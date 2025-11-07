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
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const mode = location.state?.mode || "verification"; // "reset" for forgot password flow


  useEffect(() => {
  console.log("🧭 Mode received:", mode);
  console.log("📨 Email received:", email);
}, [mode, email]);

  const { register, handleSubmit, setValue, getValues } = useForm();

  // ✅ Choose endpoints dynamically
  const verifyEndpoint =
    mode === "reset"
      ? "/api/auth/verify-pin" // password reset code verification
      : "/api/auth/verify-pin"; // signup email verification

  const resendEndpoint =
    mode === "reset"
      ? "/api/auth/reset-code" // resend reset password code
      : "/api/auth/register"; // resend signup verification code

  // 🔹 Timer countdown logic
  useEffect(() => {
    if (!canResend && seconds > 0) {
      const interval = setInterval(() => setSeconds((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (seconds === 0) {
      setCanResend(true);
    }
  }, [seconds, canResend]);

  // 🔹 Resend code handler
  const handleResend = async () => {
    if (canResend) {
      try {
        console.log("📩 Resending verification code...");
        setSeconds(60);
        setCanResend(false);

        await axiosInstance.post(resendEndpoint, { email });

        console.log("✅ Code resent successfully");
      } catch (error: any) {
        console.error(
          "❌ Failed to resend code:",
          error.response?.data || error.message
        );
      }
    }
  };

  // 🔹 Submit verification form
  const onSubmit = async (data: Record<string, string>) => {
    const pin = `${data.code1}${data.code2}${data.code3}${data.code4}`;

    try {
      console.log("Sending verification data:", { email, pin });

      const response = await axiosInstance.post(verifyEndpoint, {
        email,
        pin
      });

      if (response.data.success) {
        console.log("✅ Verification successful");

        if (mode === "reset") {
          // Forgot password flow → Go to reset password
          navigate("/forgot", { state: { email } });
        } else {
          // Signup flow → Go to success page
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
      console.error(
        "❌ Verification failed:",
        error.response?.data || error.message
      );
      setError(true);
      setTimeout(() => setError(false), 700);
    }
  };

  // 🔹 Handle input auto-advance and submission
  const handleInput = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    setValue(`code${index + 1}`, value);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const currentValues = Array.from({ length: 4 }, (_, i) =>
      getValues(`code${i + 1}`)
    );
    if (currentValues.every((v) => v?.length === 1)) {
      handleSubmit(onSubmit)();
    }
  };

  // 🔹 Handle backspace navigation
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
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
    <div className={styles.Signupconatiner}>
      <div className={styles.closeIcon}>
        <IoMdClose
          size={28}
          onClick={() => navigate(mode === "reset" ? "/login" : "/signup")}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.headingContainer}>
          <h1 className={styles.textHeading}>
            {mode === "reset"
              ? "Check your email for a reset code"
              : "Verify Your Account"}
          </h1>
        </div>

        <div className={styles.subtitles}>
          <p>
            A 4-digit code has been sent to{" "}
            <strong>{email || "the email you provided"}</strong>
          </p>
        </div>

        {/* 🔹 Code Inputs */}
        <div className={styles.codeBox}>
          {[1, 2, 3, 4].map((num, index) => (
            <input
              key={num}
              className={`${styles.inputDesign} ${
                error ? styles.inputError : ""
              }`}
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

        {/* 🔹 Resend Code Section */}
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
  );
};

export default VerifyEmail;
