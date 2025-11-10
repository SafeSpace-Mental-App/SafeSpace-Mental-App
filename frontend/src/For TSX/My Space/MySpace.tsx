import Navbar from "../components/Common Component/Navbar";

import styles from "./MySpace.module.css";
import { useNavigate } from "react-router-dom";
import { FiSun, FiHeart, FiLogOut, FiLogIn } from "react-icons/fi";
import { useEffect, useState } from "react";

const MySpace = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const [username, setUsername] = useState("there");
  // const username = location.state?.username || "friend";
  useEffect(() => {
    const name = localStorage.getItem("username");
    if (name && name !== "Anonymous") {
      setUsername(name);
    }
  }, []);
  const handleMoodLog = () => {
    navigate("/mood");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear auth
    localStorage.removeItem("user");
    localStorage.removeItem("currentUserId");
    navigate("/signin");
  };

  const moods = ["😞", "🙁", "😐", "🙂", "😁", "➕"];

  return (
    <div className={styles.mySpace}>
      <img
        src="/images/SplashScreenImg.png"
        alt="Splashscreen"
        className={styles.imgTop}
      />
      <div className={styles.greeting}>
        <h2>
          Hi, <span className={styles.username}>{username}👋</span>
        </h2>
        <p>How are you feeling today?</p>
      </div>

      <div className={styles.tipBox}>
        💡 Take a short break and stretch your body today!
      </div>

      <div className={styles.section}>
        <h3>Mood check time ☁️ — what’s it saying today?</h3>
        <div className={styles.moodRow}>
          {moods.map((mood, index) => (
            <span key={index} className={styles.moodEmoji}>
              {mood}
            </span>
          ))}
        </div>
        <button onClick={handleMoodLog} className={styles.actionBtn}>
          Tap to log your mood
        </button>
      </div>
      {/* Energy Focus Section (small motivation) */}
      <section className={styles.energyBox}>
        <h3>
          <FiSun /> Energy Focus
        </h3>
        <p>
          🌱 Keep your energy where it matters most — protecting your peace and
          growing your joy.
        </p>
        <button className={styles.actionBtn}>
          <FiHeart /> Do One Kind Thing Today
        </button>
      </section>

      {localStorage.getItem("token") ? (
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <FiLogOut className={styles.logoutIcon} />
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => navigate("/signin")}
          className={styles.loginBtn} // reuse same style or make a new one
        >
          <FiLogIn className={styles.logoutIcon} />
          Sign In
        </button>
      )}
      <Navbar />
    </div>
  );
};

export default MySpace;
