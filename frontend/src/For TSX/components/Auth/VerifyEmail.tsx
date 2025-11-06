// VerifyEmail.tsx
import { useForm } from "react-hook-form";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./VerifyEmail.module.css";
import Button from "../ReusableField/Button";
import { useEffect, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";

// ❌ Removed the prop-based interface & prop usage
// interface verifyProps {
//   mode: "verification" | "reset";
// }

// ✅ We’ll now detect mode dynamically from route state
const VerifyEmail = () => {
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const mode = location.state?.mode || "verification"; // ✅ Added: detect mode dynamically

  const { register, handleSubmit, setValue, getValues } = useForm();

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
      try {
        console.log("📩 Resending verification code...");
        setSeconds(60);
        setCanResend(false);
        await axiosInstance.post("/api/auth/verify-pin", { email });
        console.log("✅ Code resent successfully");
      } catch (error: any) {
        console.error("❌ Failed to resend code:", error.response?.data || error.message);
      }
    }
  };

  // On submit
  const onSubmit = async (data: Record<string, string>) => {
    const code = `${data.code1}${data.code2}${data.code3}${data.code4}$`;

    try {
      const response = await axiosInstance.post("/api/auth/verify-pin", {
        email,
        code,
      });

      if (response.data.success) {
        console.log("✅ Verification successful");

        // ✅ Added: Conditional navigation based on mode
        if (mode === "reset") {
          navigate("/reset-password", { state: { email } });
        } else {
          navigate("/verificationSuccess", {
            state: { username: location.state?.username },
          });
        }
      } else {
        console.log("❌ Invalid or expired code");
        setError(true);
        setTimeout(() => setError(false), 700);
      }
    } catch (error: any) {
      console.error("❌ Verification failed:", error.response?.data || error.message);
      setError(true);
      setTimeout(() => setError(false), 700);
    }
  };

  // 🔹 Improved OTP input behavior
  const handleInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;
    setValue(`code${index + 1}`, value);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const currentValues = Array.from({ length: 4 }, (_, i) => getValues(`code${i + 1}`));
    if (currentValues.every((v) => v?.length === 1)) {
      handleSubmit(onSubmit)();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const currentInput = inputRefs.current[index];
      if (currentInput && currentInput.value) {
        setValue(`code${index + 1}`, "");
        currentInput.value = "";
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <>
      <div className={styles.Signupconatiner}>
        <div className={styles.closeIcon}>
          <IoMdClose
            size={28}
            // ✅ Updated: Back navigation depends on mode
            onClick={() => navigate(mode === "reset" ? "/login" : "/signup")}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.headingContainer}>
            <h1 className={styles.textHeading}>
              {mode === "verification"
                ? "Verify Your Account"
                : "Check your email for a verification code"}
            </h1>
          </div>

          <div className={styles.subtitles}>
            <p>
              A 4-digit code has been sent to your email{" "}
              <strong>{email || "you provided during signup"}</strong>
            </p>
          </div>

          {/* 🔹 Verification Code Inputs */}
          <div className={styles.codeBox}>
            {[1, 2, 3, 4].map((num, index) => (
              <input
                key={num}
                className={`${styles.inputDesign} ${error ? styles.inputError : ""}`}
                type="text"
                maxLength={1}
                {...register(`code${num}` as const, {
                  required: "Verification code is required",
                })}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => handleInput(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          <Button text="Verify Account" type="submit" />

          {/* 🔹 Resend Text */}
          <div className={styles.resendText}>
            {!canResend ? (
              <>
                Didn’t get the code?{" "}
                <span style={{ color: "var(--brand-color)" }}>Resend in {seconds}s</span>
              </>
            ) : (
              <div className={styles.resendText}>
                <span>Didn’t get the code?</span>
                <button type="button" onClick={handleResend} className={styles.resendBtn}>
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
