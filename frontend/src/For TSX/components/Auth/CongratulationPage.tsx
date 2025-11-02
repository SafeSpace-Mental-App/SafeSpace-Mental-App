import Button from "../ReusableField/Button";
import styles from "./CongtstulationPage.module.css";
import { useNavigate, useLocation } from "react-router-dom";
const CongratulationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || 'user';

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
            Congratulations, {username}! Verification Successful 🎉
          </h2>
          <p className={styles.congratMessage}>
            Your account has been created successfully. Welcome to your
            SafeSpace - <br />
            where your thoughts stay private and your data stays secure.
          </p>
          <div>
            <Button
              className={styles.congratButton}
              text="Continue to Dashboard"
              type="button"
              onClick={() => navigate("/signin")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CongratulationPage;
