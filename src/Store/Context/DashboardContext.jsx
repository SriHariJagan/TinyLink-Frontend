// src/context/DashboardContext.jsx
import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";

import axios from "axios";
import { AuthContext } from "./AuthContext";
import { ShortenContext } from "./ShortenContext";


const BASE_URL = import.meta.env.VITE_BASE_URL;


export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const { result } = useContext(ShortenContext);

  const [stats, setStats] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);


  /* --------------------------------------------------------
   * DUMMY FALLBACK DATA (when backend not connected yet)
   * -------------------------------------------------------- */
  const dummyStats = {
    totalLinks: 5,
    totalClicks: 1784,
    popular: "tinyl.ink/home",
    activity: "Just now",
  };

  const dummyLinks = [
    {
      id: "1",
      title: "Home",
      short: "tinyl.ink/home",
      long: "https://example.com/home",
      clicks: 245,
      lastClicked: "2024-01-10 10:21",
    },
    {
      id: "2",
      title: "About Page",
      short: "tinyl.ink/about",
      long: "https://example.com/about",
      clicks: 187,
      lastClicked: "2024-01-09 14:50",
    },
  ];

  /* --------------------------------------------------------
   * FETCH DASHBOARD DATA
   * -------------------------------------------------------- */
  const fetchDashboard = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/shortlink/my-links`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      setStats(res.data.stats);
      setLinks(res.data.links);
    } catch (err) {
      console.log("⚠️ Backend not ready. Using dummy dashboard.");
      setStats(dummyStats);
      setLinks(dummyLinks);
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* Load dashboard at startup */
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* Re-fetch when ShortenContext creates/updates a link */
  useEffect(() => {
    if (result) fetchDashboard();
  }, [result]);

  /* --------------------------------------------------------
   * DELETE LINK
   * -------------------------------------------------------- */
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/shortlink/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // remove instantly
      setLinks((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.log("⚠️ Delete failed. Removing from UI only.");
      setLinks((prev) => prev.filter((i) => i.id !== id));
    }
  };

  /* --------------------------------------------------------
   * COPY TO CLIPBOARD
   * -------------------------------------------------------- */
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    alert("Copied: " + url);
  };

  return (
    <DashboardContext.Provider
      value={{
        stats,
        links,
        loading,
        handleCopy,
        handleDelete,
        refreshDashboard: fetchDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
