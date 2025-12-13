import React, { useState, useEffect, useContext } from 'react';
import styles from './ShortenForm.module.css';
import { FiLink, FiTag } from 'react-icons/fi';
import { MdContentCopy, MdAutorenew } from 'react-icons/md';
import { ShortenContext } from '../../Store/Context/ShortenContext';

const ShortenForm = ({ initialData = null, onClose }) => {
  const { createShortURL, updateShortURL } = useContext(ShortenContext);

  const [destination, setDestination] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // Field errors
  const [errors, setErrors] = useState({
    destination: "",
    shortCode: "",
  });

  // Fill form when editing
  useEffect(() => {
    if (initialData) {
      setDestination(initialData.longUrl);
      setShortCode(initialData.shortCode || '');
      setTitle(initialData.title || '');
    }
  }, [initialData]);

  const handleGenerate = () => {
    const code = Math.random().toString(36).substring(2, 8);
    setShortCode(code);
    setErrors(prev => ({ ...prev, shortCode: "" }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortCode);
  };

  const validate = () => {
    const newErrors = {};

    if (!destination) {
      newErrors.destination = "Destination URL is required.";
    } else if (!/^https?:\/\/.+\..+/.test(destination)) {
      newErrors.destination = "Enter a valid URL.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    let res;
    if (initialData) {
      res = await updateShortURL(initialData._id, {
        longUrl: destination,
        shortCode,
        title,
      });
    } else {
      res = await createShortURL(destination, shortCode, title);
    }

    // Handle backend error
    if (!res.success) {
      if (res.message.includes("Short code")) {
        setErrors(prev => ({ ...prev, shortCode: res.message }));
      } else {
        setErrors(prev => ({ ...prev, form: res.message }));
      }
    } else {
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {initialData ? 'Edit Short Link' : 'Create a Short Link'}
      </h2>

      {/* Destination URL */}
      <label className={styles.label}>Destination URL</label>
      <div className={styles.inputWrapper}>
        <FiLink className={styles.icon} />
        <input
          type="text"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            setErrors(prev => ({ ...prev, destination: "" }));
          }}
          className={styles.input}
          placeholder="https://example.com"
        />
      </div>
      {errors.destination && (
        <p className={styles.error}>{errors.destination}</p>
      )}

      {/* Short Code */}
      <label className={styles.label}>Short Link</label>
      <div className={styles.shortLinkWrapper}>
        <select className={styles.select} disabled>
          <option>tinylk.netlify.app/</option>
        </select>
        <span className={styles.slash}>/</span>

        <input
          type="text"
          value={shortCode}
          onChange={(e) => {
            setShortCode(e.target.value);
            setErrors(prev => ({ ...prev, shortCode: "" }));
          }}
          placeholder="Enter or generate"
          className={styles.input}
          style={{padding: "12px"}}
        />

        <button onClick={handleGenerate} className={styles.generateBtn}>
          <MdAutorenew />
        </button>
        <button onClick={handleCopy} className={styles.copyBtn}>
          <MdContentCopy />
        </button>
      </div>

      {errors.shortCode && (
        <p className={styles.error}>{errors.shortCode}</p>
      )}

      {/* Title */}
      <label className={styles.label}>Title (optional)</label>
      <div className={styles.inputWrapper}>
        <FiTag className={styles.icon} />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          placeholder="My campaign link"
        />
      </div>

      {/* Form error */}
      {errors.form && <p className={styles.error}>{errors.form}</p>}

      {/* Actions */}
      <div className={styles.actions}>
        <button
          onClick={handleSubmit}
          className={styles.saveBtn}
          disabled={loading}
        >
          {loading ? "Saving..." : initialData ? "Update" : "Create"}
        </button>
        <button className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ShortenForm;
