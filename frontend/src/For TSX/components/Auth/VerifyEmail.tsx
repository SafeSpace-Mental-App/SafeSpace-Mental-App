// // VerifyEmail.tsx
// import { useForm } from "react-hook-form";
// import axiosInstance from "../../../api/axiosInstance";
// import { useNavigate, useLocation } from "react-router-dom";
// import styles from "./VerifyEmail.module.css";
// import Button from "../ReusableField/Button";
// import { useEffect, useState, useRef } from "react";
// import { IoMdClose } from "react-icons/io";

// interface verifyProps {
//   mode: "verification" | "reset";
// }

// const VerifyEmail = ({ mode }: verifyProps) => {
//   const [seconds, setSeconds] = useState(60);
//   const [canResend, setCanResend] = useState(false);
//   const [error, setError] = useState(false); // 🔹 for red border + shake animation
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   // 🔹 Timer countdown
//   useEffect(() => {
//     if (!canResend && seconds > 0) {
//       const interval = setInterval(() => {
//         setSeconds((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     } else if (seconds === 0) {
//       setCanResend(true);
//     }
//   }, [seconds, canResend]);

//   // 🔹 Handle resend logic
//   const handleResend = async () => {
//     if (canResend) {
//       console.log("📩 Resending verification code...");
//       setSeconds(60);
//       setCanResend(false);
//       await axiosInstance.post("/resend-code", { email });
//     }
//   };

//   // 🔹 React Hook Form setup
//   const { register, handleSubmit } = useForm();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = location.state?.email;

//   // 🔹 Handle Submit
//   // const onSubmit = async (data: {
//   //   code1: string;
//   //   code2: string;
//   //   code3: string;
//   //   code4: string;
//   //   code5: string;
//   // }) => {
//   //   try {
//   //     const code = `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}`;
//   //     const response = await axiosInstance.post("/verify-code", { email, code });

//   //     if (response.data.success) {
//   //       navigate("/congratulationspage", {
//   //         state: { username: location.state?.username },
//   //       });
//   //     } else {
//   //       // 🔹 trigger red + shake
//   //       setError(true);
//   //       setTimeout(() => setError(false), 700);
//   //     }
//   //   } catch (error: any) {
//   //     console.error("❌ Verification failed:", error.response?.data || error.message);
//   //     setError(true);
//   //     setTimeout(() => setError(false), 700);
//   //   }
//   // };

//   const onSubmit = async (data: Record<string, string>) => {
//     const code = `${data.code1 || ""}${data.code2 || ""}${data.code3 || ""}${
//       data.code4 || ""
//     }${data.code5 || ""}`;

//     console.log("User entered code:", code); // 👈 See what it reads

//     // ✅ Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     const fakeServerCode = "12345";

//     if (code === fakeServerCode) {
//       console.log("✅ Code matched, navigating...");
//       navigate("/verificationSuccess", {
//         state: { username: "TestUser" },
//       });
//     } else {
//       console.log("❌ Code mismatch!");
//       setError(true);
//       setTimeout(() => setError(false), 700);
//     }
//   };

//   // 🔹 Auto focus movement
//   const handleInput = (
//     index: number,
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const value = e.target.value;
//     if (value && index < 4) {
//       inputRefs.current[index + 1]?.focus();
//     } else if (!value && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   return (
//     <>
//       <div className={styles.Signupconatiner}>
//         <div className={styles.closeIcon}>
//           <IoMdClose size={28} onClick={() => navigate("/signup")} />
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className={styles.headingContainer}>
//             <h1 className={styles.textHeading}>
//               {mode === "verification"
//                 ? "Verify Your Account"
//                 : "Check your email for a verification code"}
//             </h1>
//           </div>

//           <div className={styles.subtitles}>
//             <p>
//               A 5-digit code has been sent to your email{" "}
//               <strong>{email || "you provided during signup"}</strong>
//             </p>
//           </div>

//           {/* 🔹 Verification Code Inputs */}
//           <div className={styles.codeBox}>
//             {[1, 2, 3, 4, 5].map((num, index) => (
//               <input
//                 key={num}
//                 className={`${styles.inputDesign} ${
//                   error ? styles.inputError : ""
//                 }`}
//                 type="text"
//                 maxLength={1}
//                 {...register(`code${num}` as const, {
//                   required: "Verification code is required",
//                 })}
//                 ref={(el) => (inputRefs.current[index] = el)}
//                 onChange={(e) => handleInput(index, e)}
//                 onKeyDown={(e) => {
//                   if (
//                     e.key === "Backspace" &&
//                     !e.currentTarget.value &&
//                     index > 0
//                   ) {
//                     inputRefs.current[index - 1]?.focus();
//                   }
//                 }}
//               />
//             ))}
//           </div>

//           <Button text="Verify Account" type="submit" />

//           {/* 🔹 Resend Text */}
//           <div className={styles.resendText}>
//             {!canResend ? (
//               <>
//                 Didn’t get the code?{" "}
//                 <span style={{ color: "var(--brand-color)" }}>
//                   Resend in {seconds}s
//                 </span>
//               </>
//             ) : (
//               <div className={styles.resendText}>
//                 <span>Didn’t get the code?</span>
//                 <button
//                   type="button"
//                   onClick={handleResend}
//                   className={styles.resendBtn}
//                 >
//                   Resend Code
//                 </button>
//               </div>
//             )}
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default VerifyEmail;

// VerifyEmail.tsx
import { useForm } from "react-hook-form";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./VerifyEmail.module.css";
import Button from "../ReusableField/Button";
import { useEffect, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";

interface verifyProps {
  mode: "verification" | "reset";
}

const VerifyEmail = ({ mode }: verifyProps) => {
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState(false); // 🔹 for red border + shake animation
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // 🔹 React Hook Form setup
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
      console.log("📩 Resending verification code...");
      setSeconds(60);
      setCanResend(false);
      await axiosInstance.post("/resend-code", { email });
    }
  };

  // 🔹 Handle Submit (simulate API until backend ready)
  const onSubmit = async (data: Record<string, string>) => {
    const code = `${data.code1 || ""}${data.code2 || ""}${data.code3 || ""}${
      data.code4 || ""
    }${data.code5 || ""}`;

    console.log("🚀 onSubmit fired!");
    if (code.length < 5) {
      console.warn("⚠️ Incomplete code entered");
      return;
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const fakeServerCode = "12345";

    if (code === fakeServerCode) {
      console.log("✅ Code matched, navigating...");
      navigate("/verificationSuccess", {
        state: { username: "TestUser" },
      });
    } else {
      console.log("❌ Invalid code!");
      setError(true);
      setTimeout(() => setError(false), 700);
    }
  };

  // 🔹 Improved OTP input behavior
  const handleInput = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    // Only digits
    if (!/^[0-9]?$/.test(value)) return;

    setValue(`code${index + 1}`, value);

    // Move forward only when user types a number
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 5 digits are filled
    const currentValues = Array.from({ length: 5 }, (_, i) =>
      getValues(`code${i + 1}`)
    );
    if (currentValues.every((v) => v?.length === 1)) {
      handleSubmit(onSubmit)();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      const currentInput = inputRefs.current[index];
      if (currentInput && currentInput.value) {
        // Clear current field only
        setValue(`code${index + 1}`, "");
        currentInput.value = "";
      } else if (index > 0) {
        // Move back if current empty
        inputRefs.current[index - 1]?.focus();
      }
    }

    // ✅ Optional navigation with arrow keys
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
          <IoMdClose size={28} onClick={() => navigate("/signup")} />
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
              A 5-digit code has been sent to your email{" "}
              <strong>{email || "you provided during signup"}</strong>
            </p>
          </div>

          {/* 🔹 Verification Code Inputs */}
          <div className={styles.codeBox}>
            {[1, 2, 3, 4, 5].map((num, index) => (
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
                ref={(el) => (inputRefs.current[index] = el)}
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
