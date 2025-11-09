import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import styles from "./AuthForm.module.css";
import InputField from "../ReusableField/InputField";
import Button from "../ReusableField/Button";
import TheFooter from "../ReusableField/TheFooter";
import SocialAuth from "../ReusableField/SocialAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { useForm } from "react-hook-form";
import type { SubmitHandler, FieldError } from "react-hook-form";

interface AuthFormProps {
  mode: "signin" | "forgot";
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      if (mode === "signin") {
        // ✅ Sign-in logic
        const response = await axiosInstance.post("/api/auth/login", {
          email: data.email,
          password: data.password,
        });

        console.log("✅ Login successful:", response.data);

        // 🧠 FIX: Save token + username for FeedPage ownership tracking
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }

        // Try different structures based on your backend response
        if (response.data?.user?.username) {
          localStorage.setItem("username", response.data.user.username);
        } else if (response.data?.username) {
          localStorage.setItem("username", response.data.username);
        } else if (response.data?.user?.email) {
          // fallback if username not provided
          localStorage.setItem("username", response.data.user.email);
        } else {
          // if none, fallback to email
          localStorage.setItem("username", data.email);
        }

        navigate("/feed");
      } else {
        // ✅ Create new password logic
        const email = location.state?.email || "placeholder@example.com";

        const response = await axiosInstance.post("/api/auth/reset-password", {
          email,
          newpassword: data.password,
        });

        console.log("📩 Password Reset:", response.data);
        navigate("/login");
      }
    } catch (error: any) {
      console.error(
        `❌ ${mode === "signin" ? "Login" : "Password reset"} failed:`,
        error.response?.data?.message || error.message
      );
    }
  };

  const password = watch("password");

  return (
    <div className={styles.Signupconatiner}>
      <IoIosArrowBack
        className={styles.backIcon}
        size={24}
        onClick={() => navigate(-1)}
        style={{ cursor: "pointer" }}
      />

      <div>
        <h1 className={styles.title}>
          {mode === "signin" ? "Welcome back! 😊" : "Create a New Password"}
        </h1>
        <p className={styles.subtitles}>
          {mode === "signin"
            ? "Let's get back into your safe space where you can breathe, reflect, and just be"
            : "Let's get you back safely"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {mode === "signin" ? (
          <>
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
              <p className={styles.errorText}>
                {getErrorMessage(errors.email)}
              </p>
            )}

            <InputField
              key={showPassword ? "text" : "password"}
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              register={register}
              required
              validationRules={{
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$]).{8,}$/,
                  message:
                    "Password must include uppercase, number, and special character (!@#$)",
                },
              }}
            />
            {getErrorMessage(errors.password) && (
              <p className={styles.errorText}>
                {getErrorMessage(errors.password)}
              </p>
            )}

            <p>
              <Link
                to="/forgotMessagepage"
                state={{ email: watch("email") || "user@example.com" }}
                className={styles.FogetPassword}
              >
                Forget password?
              </Link>
            </p>

            <Button
              text={loading ? "Signing in  ..." : "Sign in"}
              type="submit"
            />
            <div className={styles.buttomText}>
              <p>
                Don’t have an Account? <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              register={register}
              required
              validationRules={{
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$]).{8,}$/,
                  message:
                    "Password must include uppercase, number, and special character (!@#$)",
                },
              }}
            />
            {getErrorMessage(errors.password) && (
              <p className={styles.errorText}>
                {getErrorMessage(errors.password)}
              </p>
            )}

            <InputField
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              required
              register={(name) =>
                register(name, {
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })
              }
            />

            <label className={styles.showPasswordLabel}>
              <input
                type="checkbox"
                onChange={() => setShowPassword(!showPassword)}
              />{" "}
              Show Password
            </label>

            <Button text="Create New Password" type="submit" />
          </>
        )}

        <TheFooter />
        <SocialAuth />
      </form>
    </div>
  );
};

export default AuthForm;
