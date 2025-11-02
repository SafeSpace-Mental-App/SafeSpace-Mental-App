// VerifyEmail.tsx
import { useForm } from "react-hook-form";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./VerifyEmail.module.css";
import Button from "../ReusableField/Button";
import { useEffect, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";

const VerifyEmail = () => {
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 🔹 Timer countdown
  useEffect(() => {
    if (!canResend && seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (seconds === 0) {
      setCanResend(true);
    }
  }, [seconds, canResend]);

  // 🔹 Handle resend logic
  const handleResend = async () => {
    if (canResend) {
      console.log("📩 Resending verification code...");
      setSeconds(60);
      setCanResend(false);
      await axiosInstance.post("/resend-code", { email });
    }
  };

  // 🔹 React Hook Form setup
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // 🔹 Handle Submit
  const onSubmit = async (data: {
    code1: string;
    code2: string;
    code3: string;
    code4: string;
    code5: string;
  }) => {
    try {
      const code = `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}`;
      const response = await axiosInstance.post("/verify-code", {
        email,
        code,
      });

      if (response.data.success) {
        navigate("/congratulationspage", {
          state: { username: location.state?.username },
        });
      } else {
        alert("❌ Invalid or expired code");
      }
    } catch (error: any) {
      console.error(
        "❌ Verification failed:",
        error.response?.data || error.message
      );
    }
  };

  // 🔹 Auto focus movement
  const handleInput = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <>
      <div className={styles.closeIcon}>
        <IoMdClose size={28} onClick={() => navigate("/signup")} />
      </div>

      <div className={styles.Signupconatiner}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.headingContainer}>
            <h1 className={styles.textHeading}>Verify Your Account</h1>
          </div>

          <div className={styles.subtitles}>
            <p>
              A 5-digit code has been sent to your email{" "}
              <strong>{email || "you provided during signup"}</strong>
            </p>
          </div>

          {/* 🔹 Verification Code Inputs */}
          <div className={styles.codeBox}>
            {[1, 2, 3, 4, 5].map((num, index) => (
              <input
                key={num}
                className={styles.inputDesign}
                type="text"
                maxLength={1}
                {...register(`code${num}` as const, {
                  required: "Verification code is required",
                })}
                ref={(el) => (inputRefs.current[index] = el)} //  index is defined
                onChange={(e) => handleInput(index, e)} //  is valid here too
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    !e.currentTarget.value &&
                    index > 0
                  ) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
              />
            ))}
          </div>

          <Button text="Verify Account" type="submit" />

          {/* 🔹 Resend Text */}
          <div className={styles.resendText}>
            {!canResend ? (
              <>
                Didn’t get the code?{" "}
                <span style={{ color: "var(--brand-color)" }}>
                  Resend in {seconds}s
                </span>
              </>
            ) : (
              <div className={styles.resendText}>
                <span>Didn’t get the code?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  className={styles.resendBtn}
                >
                  Resend Code
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default VerifyEmail;
