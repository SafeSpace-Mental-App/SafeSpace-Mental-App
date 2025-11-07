import Button from "../ReusableField/Button";
import styles from "./CongratulationPage.module.css";
import { useNavigate, useLocation } from "react-router-dom";

interface CongratProps {
  mode: "verification" | "reset";
}

const CongratulationPage = ({ mode }: CongratProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || "user";

  return (
    <>
      <div className={styles.congratulationsContainer}>
        <div className={styles.subContainer}>
          <div className={styles.topImage}>
            <img
              src="/images/Verification.png"
              alt="Verification"
              className={styles.successimg}
            />
          </div>
          <h2 className={styles.congratHeading}>
            {mode === "verification"
              ? `Congratulations, ${username}! Verification Successful 🎉`
              : `Congratulations, ${username}! Password Reset Successful 🎉`}
          </h2>
          <p className={styles.congratMessage}>
            {mode === "verification"
              ? " Your account has been created successfully. Welcome to yourSafeSpace -  \nwhere your thoughts stay private and your data stays secure."
              : "Your new password has been updated successfully.\nWelcome back to your SafeSpace - where your thoughts stay private andyour data stays secure."}
          </p>
          <div>
            <Button
              className={styles.congratButton}
              text="Continue to Dashboard"
              type="button"
              onClick={() => {
                if (mode === "verification") {
                  navigate("/signin");
                } else {
                  navigate("/feed");
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CongratulationPage;
