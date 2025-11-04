import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import styles from "./SocialAuth.module.css";

export default function SocialAuth() {
  // 🔹 Google Sign-In handler
  const handleGoogleAuth = () => {
    //  Mock mode (for testing before backend OAuth)
    alert("✅ Google login successful (mock)");

    //  When backend is ready, replace this with:
    // window.location.href = "http://localhost:5000/auth/google";
  };

  //  Apple Sign-In handler
  const handleAppleAuth = () => {
    //  Mock mode (for testing before backend OAuth)
    alert("🍎 Apple login successful (mock)");

    //  When backend is ready, replace this with:
    // window.location.href = "http://localhost:5000/auth/apple";
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <button className={styles.btn} onClick={handleGoogleAuth}>
          <FcGoogle className={styles.icon} />
        </button>

        <button className={styles.btn} onClick={handleAppleAuth}>
          <FaApple className={styles.icon} />
        </button>
      </div>
    </div>
  );
}
