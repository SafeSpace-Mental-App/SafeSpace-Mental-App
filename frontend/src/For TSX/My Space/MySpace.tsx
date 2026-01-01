import Navbar from "../components/Common Component/Navbar";

import styles from "./MySpace.module.css";
import { useNavigate } from "react-router-dom";
import { FiSun, FiHeart, FiLogOut, FiLogIn } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useUser } from "../My Space/For Hooks/useUser";
import axiosInstance from "../../api/axiosInstance";

const MySpace = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("there");

  // HOOKS
  const { user, updateAvatar } = useUser();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar
  );

  const [showModal, setShowModal] = useState<boolean>(false);
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

  // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const imageUrl = URL.createObjectURL(file);

  //   setAvatarPreview(imageUrl);
  //   updateAvatar(imageUrl);
  // };
  // const oldAvatar = user.avatar;
  // const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();

  //   reader.onloadend = async () => {
  //     const base64 = reader.result as string;

  //     // optimistic UI (instant feedback)
  //     setAvatarPreview(base64);
  //     updateAvatar(base64);

  //     try {
  //       await axiosInstance.put("/api/users/avatar", {
  //         avatar: base64,
  //       });
  //     } catch (err) {
  //       updateAvatar(oldAvatar);
  //       setAvatarPreview(oldAvatar);
  //       console.error("Avatar upload failed", err);
  //     }
  //   };

  //   reader.readAsDataURL(file);
  // };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;

      // update locally
      setAvatarPreview(base64);
      updateAvatar(base64);

      try {
        const res = await axiosInstance.put("/api/users/avatar", {
          avatar: base64,
        });
        // update your UserContext with backend-confirmed avatar
        updateAvatar(res.data.avatar);
      } catch (err) {
        console.error("Avatar upload failed", err);
        // optionally save offline for retry
      }
    };
    reader.readAsDataURL(file);
  };

  const moods = ["😞", "🙁", "😐", "🙂", "😁", "➕"];

  // useEffect(() => {
  //   if (!avatarPreview && user.avatar) {
  //     setAvatarPreview(user.avatar);
  //   }
  // }, [user.avatar]);

  return (
    <>
      <div className={styles.mySpace}>
        <div className={styles.imgTopContainer}>
          <img
            src="/images/SplashScreenImg.png"
            alt="Splashscreen"
            className={styles.imgTop}
          />
        </div>

        <div className={styles.avatarSection}>
          <img
            src={avatarPreview ?? "/images/anon1.png"}
            alt="Profile"
            className={styles.avatar}
            onClick={() => {
              setShowModal((p) => !p);
            }}
          />

          {showModal && (
            <label className={styles.changeAvatarBtn}>
              Change photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </label>
          )}
        </div>

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
            🌱 Keep your energy where it matters most — protecting your peace
            and growing your joy.
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
      </div>
      <Navbar />
    </>
  );
};

export default MySpace;
