import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SplashScreen.module.css"; // optional styling

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding"); // go to onboarding after 1s
    }, 1000); // 1 second

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.splashContainer}>
      <img
        src="/images/SplashScreenImg.png"
        alt="SafeSpace Logo"
        className="splash-logo"
      />
    </div>
  );
}
