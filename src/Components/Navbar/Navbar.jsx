import React, { useContext, useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { Sun, Moon, ChevronDown, LogOut, User } from "lucide-react";
import { AuthContext } from "../../Store/Context/AuthContext";

const Navbar = () => {
  const [dropdown, setDropdown] = useState(false);
  const [theme, setTheme] = useState("light");
  const {logout} = useContext(AuthContext);

  // Load saved theme once (prevents flicker)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.add(savedTheme);
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        {" "}
        <span className={styles.logoIcon}>TL</span>{" "}
        <span className={styles.logoTitle}>TinyLink</span>{" "}
      </div>

      <div className={styles.right}>
        <button className={styles.themeBtn} onClick={toggleTheme}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className={styles.profile} onClick={() => setDropdown(!dropdown)}>
          <img
            src="https://cdn-icons-png.freepik.com/512/7718/7718888.png"
            className={styles.avatar}
            alt="avatar"
          />
          <ChevronDown size={16} />

          {dropdown && (
            <div className={styles.dropdown}>
              {/* <div className={styles.item}>
                <User size={15} /> Profile
              </div> */}

              <div className={`${styles.item} ${styles.logout}`} onClick={() => logout()}>
                <LogOut size={15} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
