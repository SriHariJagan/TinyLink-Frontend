import React, { useContext, useEffect, useState } from "react";
import styles from "./SingleLinkStats.module.css";
import { Copy, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { DashboardContext } from "../../Store/Context/DashboardContext";
import { ShortenContext } from "../../Store/Context/ShortenContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SingleLinkStats = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { handleCopy, refreshDashboard } = useContext(DashboardContext);
  const { getSingleLink, deleteShortURL } = useContext(ShortenContext);

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletePopup, setDeletePopup] = useState(false);

  // ------------------------------------------------------
  // Fetch Single Link
  // ------------------------------------------------------
  useEffect(() => {
    const loadLink = async () => {
      const res = await getSingleLink(id);

      if (res.success) {
        setLink(res.data?.data || {});
        setLoading(false);
      } else {
        console.log("Error loading link:", res.message);
      }

      setLoading(false);
    };

    loadLink();
  }, [id, getSingleLink]);

  // ------------------------------------------------------
  // Loading
  // ------------------------------------------------------
  if (loading) {
    return (
      <div className={styles.dashboardLoading}>
        <div className={styles.loader}></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // ------------------------------------------------------
  // Not Found
  // ------------------------------------------------------
  if (!link || Object.keys(link).length === 0) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>Link not found</p>
        <button className={styles.backBtn} onClick={() => navigate("/app")}>
          Go Back
        </button>
      </div>
    );
  }

  // ------------------------------------------------------
  // Graph Data (✅ FIXED)
  // ------------------------------------------------------
  const monthlyClicks = link.monthlyClicks || [];

  const maxClicks =
    monthlyClicks.length > 0
      ? Math.max(...monthlyClicks.map((m) => m.clicks))
      : 0;

  // Dynamic Y-axis max (minimum 10)
  const yAxisMax = Math.max(10, Math.ceil(maxClicks / 10) * 10);

  // Generate Y-axis values
  const ySteps = 5;
  const yValues = Array.from({ length: ySteps + 1 }, (_, i) =>
    Math.round((yAxisMax / ySteps) * i)
  ).reverse();

  // Build full short URL
  const fullShortUrl = `${BASE_URL}/${link.shortCode}`;

  return (
    <div className={styles.wrapper}>
      {/* ================= DETAILS CARD ================= */}
      <div className={styles.card}>
        <h2 className={styles.title}>Link Details</h2>

        <div className={styles.row}>
          <div>
            <p className={styles.label}>Short Link</p>
            <a
              href={fullShortUrl}
              className={styles.link}
              target="_blank"
              rel="noreferrer"
            >
              {fullShortUrl}
            </a>
          </div>

          <div>
            <p className={styles.label}>Original URL</p>
            <a
              href={link.longUrl}
              className={styles.link}
              target="_blank"
              rel="noreferrer"
            >
              {link.longUrl}
            </a>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <p className={styles.label}>Total Clicks</p>
            <p className={styles.value}>{link.clicks}</p>
          </div>

          <div>
            <p className={styles.label}>Last Clicked</p>
            <p className={styles.value}>
              {link.lastClickedAt
                ? new Date(link.lastClickedAt).toLocaleString()
                : "—"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.secondary}`}
            onClick={() => navigate("/app")}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <span>
            <button
              className={`${styles.btn} ${styles.primary}`}
              onClick={() => handleCopy(fullShortUrl)}
            >
              <Copy size={16} /> Copy
            </button>

            <button
              className={`${styles.btn} ${styles.danger}`}
              onClick={() => setDeletePopup(true)}
            >
              <Trash2 size={16} /> Delete
            </button>
          </span>
        </div>
      </div>

      {/* ================= GRAPH CARD ================= */}
      <div className={styles.card}>
        <h3 className={styles.title}>Monthly Clicks</h3>

        <div className={styles.graphWrapper}>
          {/* Y-Axis (fixed) */}
          <div className={styles.yAxis}>
            {yValues.map((val) => (
              <div key={val} className={styles.yLabel}>
                {val}
              </div>
            ))}
          </div>

          {/* Scrollable Area */}
          <div className={styles.graphScroll}>
            <div className={styles.graphContainer}>
              {monthlyClicks.length > 0 ? (
                monthlyClicks.map((month) => (
                  <div key={month.month} className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{
                        height: `${(month.clicks / yAxisMax) * 100}%`,
                      }}
                      title={`${month.month}: ${month.clicks} clicks`}
                    />
                  </div>
                ))
              ) : (
                <p className={styles.noData}>No click data available</p>
              )}
            </div>

            {/* X-Axis labels (INSIDE scroll) */}
            <div className={styles.graphLabels}>
              {monthlyClicks.map((month) => (
                <span key={month.month}>{month.month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= DELETE POPUP ================= */}
      {deletePopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h2>Delete Link?</h2>
            <p>This action cannot be undone.</p>

            <div className={styles.popupActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeletePopup(false)}
              >
                Cancel
              </button>

              <button
                className={styles.confirmDeleteBtn}
                onClick={async () => {
                  await deleteShortURL(id);
                  refreshDashboard();
                  setDeletePopup(false);
                  navigate("/app");
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleLinkStats;
