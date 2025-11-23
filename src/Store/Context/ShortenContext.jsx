import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";


const BASE_URL = import.meta.env.VITE_BASE_URL;


export const ShortenContext = createContext();

export const ShortenProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Base URL (change here if needed)

  // -----------------------------
  // CREATE SHORT URL
  // -----------------------------
  const createShortURL = async (longUrl, shortCode, title) => {
    if (!token) return { success: false, message: "Not logged in" };

    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/shortlink`,
        { longUrl, shortCode, title }, // 🔥 MUST MATCH BACKEND
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(res.data);
      return { success: true, data: res.data };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UPDATE SHORT URL
  // -----------------------------
  const updateShortURL = async (id, { longUrl, shortCode, title }) => {
    if (!token) return { success: false, message: "Not logged in" };

    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/shortlink/${id}`,
        { longUrl, shortCode, title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(res.data);
      return { success: true, data: res.data };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // DELETE SHORT URL
  // -----------------------------
  const deleteShortURL = async (id) => {
    if (!token) return { success: false, message: "Not logged in" };

    try {
      setLoading(true);

      const res = await axios.delete(
        `${BASE_URL}/shortlink/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return { success: true, message: res.data.message };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // GET USER LINKS
  // -----------------------------
  const getUserLinks = async () => {
    if (!token) return { success: false, message: "Not logged in" };

    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/shortlink/my-links`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { success: true, data: res.data };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // OPTIONAL: CREATE QR CODE
  // -----------------------------
  const createQR = async (longUrl) => {
    if (!token) return { success: false, message: "Not logged in" };

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/qr/generate`,
        { longUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(res.data);
      return { success: true, data: res.data };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
// GET SINGLE LINK BY ID
// -----------------------------
const getSingleLink = async (id) => {
  if (!token) return { success: false, message: "Not logged in" };

  try {
    setLoading(true);

    const res = await axios.get(`${BASE_URL}/shortlink/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Single Link Data:", res.data);


    return { success: true, data: res.data };

  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed",
    };
  } finally {
    setLoading(false);
  }
};


  return (
    <ShortenContext.Provider
      value={{
        loading,
        result,
        createShortURL,
        updateShortURL,
        deleteShortURL,
        getUserLinks,
        createQR,
        getSingleLink,
      }}
    >
      {children}
    </ShortenContext.Provider>
  );
};
