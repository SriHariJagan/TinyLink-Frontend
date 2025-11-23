import React, { useContext, useState } from "react";
import styles from "./Dashboard.module.css";
import { DashboardContext } from "../../Store/Context/DashboardContext";
import { FiEye, FiEdit2, FiCopy, FiTrash2, FiSearch } from "react-icons/fi";
import { TbLink, TbClick } from "react-icons/tb";
import { MdOutlineTrendingUp, MdAccessTime } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import ShortenForm from "../../Components/UrlShortenerForm/ShortenForm";
import ModalWrapper from "../../Components/ModalWrapper/ModalWrapper";
import { formatDate } from "../../Utils/formatDate";
import { timeAgo } from "../../Utils/timeAgo";

const Dashboard = () => {
  const { stats, links, loading, handleCopy, handleDelete, refreshDashboard } =
    useContext(DashboardContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  const [deletePopup, setDeletePopup] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState(""); // search term

  const navigate = useNavigate();

  const handleEdit = (item) => {
    const shortCode = item.short.split("/").pop();
    const formatted = {
      _id: item.id,
      longUrl: item.long,
      shortCode,
      title: item.title || "",
    };
    setSelectedLink(formatted);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedLink(null);
    setModalOpen(true);
  };

  // Filter links dynamically by title
  const filteredLinks = links.filter((item) =>
    (item.title || "Untitled")
      .toLowerCase()
      .replace(/\s+/g, "") // remove all spaces
      .includes(searchTerm.toLowerCase().replace(/\s+/g, ""))
  );

  if (loading)
    return (
      <div className={styles.dashboardLoading}>
        <div className={styles.loader}></div>
        <p>Loading Dashboard...</p>
      </div>
    );

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Dashboard</h1>
        <button className={styles.createLinkBtn} onClick={handleCreate}>
          Create Short Link
        </button>
      </div>

      {/* STATS */}
      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <TbLink />
          </div>
          <h4>Total Links</h4>
          <p className={styles.number}>{stats?.totalLinks}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <TbClick />
          </div>
          <h4>Total Clicks</h4>
          <p className={styles.number}>{stats?.totalClicks}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <MdOutlineTrendingUp />
          </div>
          <h4>Most Popular</h4>
          <p className={styles.url}>{stats?.popular}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <MdAccessTime />
          </div>
          <h4>Last Activity</h4>
          <span className={styles.lastActivity}>
            <p>{formatDate(stats?.activity)}</p>
            <p className={styles.timeAgo}>{timeAgo(stats?.activity)}</p>
          </span>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableBox}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.search}
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Short URL</th>
                <th>Long URL</th>
                <th>Clicks</th>
                <th>Last Click</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLinks.length > 0
                ? filteredLinks.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title || "Untitled"}</td>
                      <td className={styles.short}>
                        <a
                          href={item.short}
                          target="_blank"
                          onClick={() =>
                            setTimeout(() => refreshDashboard(), 600)
                          }
                        >
                          {item.short}
                        </a>
                      </td>
                      <td className={styles.long}>
                        <a href={item.long} target="_blank">
                          {item.long}
                        </a>
                      </td>
                      <td>{item.clicks}</td>
                      <td>
                        {item.lastClicked ? formatDate(item.lastClicked) : "—"}
                      </td>
                      <td className={styles.actions}>
                        <button
                          className={`${styles.btn} ${styles.view}`}
                          onClick={() => navigate(`link/${item.id}`)}
                        >
                          <FiEye />
                        </button>
                        <button
                          className={`${styles.btn} ${styles.edit}`}
                          onClick={() => handleEdit(item)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className={`${styles.btn} ${styles.copy}`}
                          onClick={() => {
                            handleCopy(item.short);
                            refreshDashboard();
                          }}
                        >
                          <FiCopy />
                        </button>
                        <button
                          className={`${styles.btn} ${styles.delete}`}
                          onClick={() => {
                            setLinkToDelete(item.id);
                            setDeletePopup(true);
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                : links.length != 0 && (
                    <tr>
                      <td colSpan={6} className={styles.noData}>
                        No matching links found
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>

          {links.length === 0 && (
            <div className={styles.noData}>No links created yet</div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <ModalWrapper
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          refreshDashboard();
        }}
      >
        <ShortenForm
          initialData={selectedLink}
          onClose={() => {
            setModalOpen(false);
            refreshDashboard();
          }}
        />
      </ModalWrapper>

      {/* DELETE POPUP */}
      <ModalWrapper isOpen={deletePopup} onClose={() => setDeletePopup(false)}>
        <div className={styles.deletePopup}>
          <h2>Delete Link?</h2>
          <p>
            This action cannot be undone. Are you sure you want to delete this
            short link?
          </p>

          <div className={styles.deleteActions}>
            <button
              className={styles.cancelBtn}
              onClick={() => setDeletePopup(false)}
            >
              Cancel
            </button>

            <button
              className={styles.confirmDeleteBtn}
              onClick={async () => {
                await handleDelete(linkToDelete);
                setDeletePopup(false);
                refreshDashboard();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
};

export default Dashboard;
