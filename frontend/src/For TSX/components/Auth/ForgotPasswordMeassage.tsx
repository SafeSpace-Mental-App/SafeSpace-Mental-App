// import React from "react";
import Button from "../ReusableField/Button";
import styles from "./Forgetpassword.module.css";
import { FiMail } from "react-icons/fi";

import { Link, useLocation, useNavigate } from "react-router-dom";

// const ForgotPasswordMeassage = () => {
//   <>
//     return (<div>ForgotPasswordMeassage</div>
// {/*
//     <Button text="Create New Password" type="submit" /> */}
//     )
//   </>;
// };

// export default ForgotPasswordMeassage;
export default function ForgotPasswordMessage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "User email";

  return (
    <div className={styles.ForgetPasswordContainer}>
      <div className={styles.ForgetHeadingContainer}>
        <h1 className={styles.ForgetTextHeading}>Forgot Password?</h1>
      </div>
      <div className={styles.ForgetSubtitles}>
        <p>No worries - we’ll help you reset it safely</p>
      </div>
      <div>
        <img
          src="/images/ForgotPassword.png"
          alt="ForgotPassword"
          style={{
            width: "250px",
            height: "200px",
            // border: "2px solid",
            objectFit: "cover",
          }}
        />
      </div>
      <p className={styles.subMessage}>
        A Verification Code will be sent to your email
      </p>
      <div className={styles.sendCodeMessage}>
        <p className={styles.codemessage}>
          <FiMail className={styles.mailIcon} /> Send code to my email
        </p>
        <p className={styles.codemessagetwo}>{email}</p>
      </div>

      <Button
        text="Continue"
        type="button"
        onClick={() => navigate("/verify-emailreset")}
      />
      <p className={styles.buttomText}>
        Can't access your email?
        <Link to={""} className="">
          Contact Support
        </Link>{" "}
      </p>
    </div>
  );
}
