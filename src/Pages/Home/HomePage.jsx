import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import { Sun, Moon, Link as LinkIcon, QrCode } from "lucide-react";
import { AuthContext } from "../../Store/Context/AuthContext";
import { ShortenContext } from "../../Store/Context/ShortenContext";

const HomePage = () => {
  const [dark, setDark] = useState(false);
  const [mode, setMode] = useState("url");
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [touched, setTouched] = useState(false);

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { createShortURL, createQR } = useContext(ShortenContext);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleTryForFree = () => {
    navigate("/login");
  };

  const validateUrl = (url) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-zA-Z0-9\\-])+\\.)+[a-zA-Z]{2,})" + // domain name
        "(\\:[0-9]{1,5})?" + // optional port
        "(\\/.*)?$" // path
    );
    return pattern.test(url);
  };

  const handleCreate = async () => {
    setTouched(true);

    if (!longUrl) return;

    if (!validateUrl(longUrl)) {
      alert("Please enter a valid URL!");
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    let res;
    if (mode === "url") {
      res = await createShortURL(longUrl, customCode);
    } else {
      res = await createQR(longUrl);
    }

    if (res.success) {
      alert(
        `Success! Your ${mode === "url" ? "short URL" : "QR code"} is ready.`
      );
      setLongUrl("");
      setCustomCode("");
      setTouched(false);
    } else {
      alert(res.message);
    }
  };

  const showError = touched && (!longUrl || !validateUrl(longUrl));

  return (
    <div className={dark ? styles.dark : styles.light}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.navInner}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>TL</span>{" "}
              <span className={styles.logoTitle}>TinyLink</span>
            </div>

            <div className={styles.navRight}>
              <button
                className={styles.themeToggle}
                onClick={() => setDark(!dark)}
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button className={styles.signupBtn} onClick={handleLoginClick}>
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            {/* LEFT */}
            <div className={styles.heroLeft}>
              <h1 className={styles.title}>
                Shorten Smarter.
                <span className={styles.gradientText}>Share Faster.</span>
              </h1>

              <p className={styles.subtitle}>
                Create branded short links, generate QR codes, track analytics—
                all in one ultra-fast platform designed for growth.
              </p>

              <div className={styles.buttons}>
                <button
                  className={styles.primaryBtn}
                  onClick={handleTryForFree}
                >
                  Try For Free
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className={styles.heroRight}>
              <div className={styles.card}>
                <div className={styles.toggle}>
                  <div
                    className={`${styles.slider} ${
                      mode === "qr" ? styles.slideRight : ""
                    }`}
                  ></div>

                  <button
                    onClick={() => setMode("url")}
                    className={mode === "url" ? styles.activeToggle : ""}
                  >
                    URL Shortener
                  </button>

                  {/* <button
                    onClick={() => setMode("qr")}
                    className={mode === "qr" ? styles.activeToggle : ""}
                  >
                    QR Generator
                  </button> */}
                </div>

                <div
                  className={`${styles.inputBox} ${
                    showError ? styles.invalidInput : ""
                  }`}
                >
                  <LinkIcon size={16} />
                  <input
                    placeholder="Enter your long URL"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    onBlur={() => setTouched(true)}
                  />
                </div>
                {showError && (
                  <span className={styles.errorText}>
                    Please enter a valid URL
                  </span>
                )}

                {mode === "url" && (
                  <div className={styles.inputBox}>
                    <QrCode size={16} />
                    <input
                      placeholder="Custom short code (optional)"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value)}
                    />
                  </div>
                )}

                <button className={styles.createBtn} onClick={handleCreate}>
                  Create Smart Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
