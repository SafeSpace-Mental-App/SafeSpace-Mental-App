import Button from "../ReusableField/Button";
import styles from "./Forgetpassword.module.css";
import { FiMail } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { useForm } from "react-hook-form";
import type { SubmitHandler, FieldError } from "react-hook-form";
import InputField from "../ReusableField/InputField";

export default function ForgotPasswordMessage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const getErrorMessage = (err: unknown): string | null => {
    if (!err) return null;
    if (typeof err === "string") return err;
    if (typeof err === "object" && err !== null && "message" in err) {
      return (err as FieldError).message || null;
    }
    return null;
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      const response = await axiosInstance.post("/api/auth/forgot-password", {
        email: data.email,
      });

      if (response.status === 200) {
        console.log("✅ Code sent successfully:", response.data);
        navigate("/verify-email", {
          state: { email: data.email, mode: "reset" },
        });
      }
    } catch (error: any) {
      console.error(
        "❌ Error sending verification code:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Email not found or server error");
    }
  };

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
        <p className={styles.codemessagetwo}>Enter your email down below</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Email Address"
          name="email"
          type="email"
          register={register}
          required
          validationRules={{
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          }}
        />
        {getErrorMessage(errors.email) && (
          <p className={styles.errorText}>{getErrorMessage(errors.email)}</p>
        )}
        <Button text="Continue" type="submit" />
      </form>

      <p className={styles.buttomText}>
        Can't access your email?
        <Link to="">Contact Support</Link>
      </p>
    </div>
  );
}
