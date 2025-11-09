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
        const response = await axiosInstance.post("/api/auth/login", {
          email: data.email,
          password: data.password,
        });

        console.log("Login successful:", response.data);

        // CLEAR OLD DATA FIRST
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");

        // SAVE TOKEN — THIS FIXES 401
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        } else {
          console.error("No token in login response!");
          alert("Login failed: No token received");
          return;
        }

        // SAVE ANONYMOUS NAME — THIS FIXES EMAIL DISPLAY
        let displayName = "Anonymous";

        if (response.data?.user?.anonymous_name) {
          displayName = response.data.user.anonymous_name;
        } else if (response.data?.anonymous_name) {
          displayName = response.data.anonymous_name;
        } else if (response.data?.user?.username) {
          displayName = response.data.user.username;
        } else if (response.data?.username) {
          displayName = response.data.username;
        } else if (response.data?.user?.email) {
          // LAST RESORT: use email prefix only
          displayName = response.data.user.email.split("@")[0];
        } else if (data.email) {
          displayName = data.email.split("@")[0];
        }

        localStorage.setItem("username", displayName);
        localStorage.setItem("email", data.email); // optional, for fallback

        console.log("Saved username:", displayName);
        console.log(
          "Saved token:",
          response.data.token.substring(0, 20) + "..."
        );

        navigate("/feed");
      } else {
        // FORGOT PASSWORD FLOW
        const email = location.state?.email || "placeholder@example.com";

        const response = await axiosInstance.post("/api/auth/reset-password", {
          email,
          newpassword: data.password,
        });

        console.log("Password Reset:", response.data);
        alert("Password updated successfully!");
        navigate("/login");
      }
    } catch (error: any) {
      console.error(
        `${mode === "signin" ? "Login" : "Password reset"} failed:`,
        error.response?.data?.message || error.message
      );
      alert(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
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
          {mode === "signin" ? "Welcome back!" : "Create a New Password"}
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
              text={loading ? "Signing in..." : "Sign in"}
              type="submit"
              disabled={loading}
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

            <Button
              text="Create New Password"
              type="submit"
              disabled={loading}
            />
          </>
        )}

        <TheFooter />
        <SocialAuth />
      </form>
    </div>
  );
};

export default AuthForm;
