import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signupform.module.css";
import InputField from "../ReusableField/InputField";
import DropdownField from "../ReusableField/DropdownField";
import DateInput from "../ReusableField/DateInput";
import Button from "../ReusableField/Button";
import TheFooter from "../ReusableField/TheFooter";
import SocialAuth from "../ReusableField/SocialAuth";
import axiosInstance from "../../../api/axiosInstance";
import { useForm } from "react-hook-form";
import type { SubmitHandler, FieldError } from "react-hook-form";

const Signupform = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (err: unknown): string | null => {
    if (!err) return null;
    if (typeof err === "string") return err;
    if (typeof err === "object" && err !== null && "message" in err) {
      return (err as FieldError).message || null;
    }
    return null;
  };

  // const onSubmit: SubmitHandler<any> = async (data) => {
  //   try {
  //      console.log("✅ Signup successful:", data);
  //     setLoading(true);
  //     const response = await axiosInstance.post("/api/auth/register", data);
  //     console.log("✅ Signup successful:", response.data);
  //     navigate("/verify-email", {
  //       state: { email: data.email, username: data.username },
  //     });
  //   } catch (error: any) {
  //     console.error("❌ Signup failed:", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      setLoading(true);

      // 🧩 Transform keys to match backend naming
      const payload = {
        first_name: data.firstname,
        last_name: data.lastName,
        anonymous_name: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone,
        country: data.country,
        dob: data.dob,
      };

      const response = await axiosInstance.post("/api/auth/register", payload);

      console.log("✅ Signup successful:", response.data);
      navigate("/verify-email", {
        state: {
          email: data.email,
          username: data.username,
          mode: "verification",
        },
      });
    } catch (error: any) {
      console.error("❌ Signup failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const password = watch("password");

  return (
    <div className={styles.Signupconatiner}>
      <header className={styles.signuptop}>
        <IoIosArrowBack
          className={styles.backIcon}
          size={24}
          onClick={() => navigate("/get-started")}
          style={{ cursor: "pointer" }}
        />
        <h1 className={styles.title}> Anonymous Thoughts 🌟</h1>
      </header>

      <p className={styles.subtitles}>
        Got something on your mind you need to get off anonymously? Create Your
        Account
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.nameRow}>
          <InputField
            label="First Name"
            name="firstname"
            required
            register={register}
          />
          <InputField
            label="Last Name"
            name="lastName"
            required
            register={register}
          />
        </div>

        <InputField
          label="Anonymous username"
          name="username"
          required
          register={register}
        />

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

        <DateInput
          label="Date of Birth"
          required
          register={register}
          name="dob"
        />
        <DropdownField
          label="Gender"
          options={["Male", "Female", "Other"]}
          required
          register={register}
          name="gender"
        />
        <DropdownField
          label="Country"
          api={true}
          required
          register={register}
          name="country"
        />

        <InputField
          label="Phone Number"
          type="tel"
          name="phone"
          register={register}
          required
          validationRules={{
            pattern: {
              value: /^[0-9]{11}$/,
              message: "Please enter a valid 11-digit phone number",
            },
          }}
        />
        {getErrorMessage(errors.phone) && (
          <p className={styles.errorText}>{getErrorMessage(errors.phone)}</p>
        )}

        <InputField
          label="Password"
          type="password"
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
          <p className={styles.errorText}>{getErrorMessage(errors.password)}</p>
        )}

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          required
          register={(name) =>
            register(name, {
              validate: (value) =>
                value === password || "Passwords do not match",
            })
          }
        />
        {getErrorMessage(errors.confirmPassword) && (
          <p className={styles.errorText}>
            {getErrorMessage(errors.confirmPassword)}
          </p>
        )}

        <div className={styles.passwordHint}>
          <FiInfo className={styles.hintIcon} />
          <p className={styles.PasswordTextHint}>
            Your password must be at least 8 characters long and include an
            uppercase letter, a number, and a special character: !@#$
          </p>
        </div>

        <div className={styles.policyContainer}>
          <input
            type="checkbox"
            id="policy"
            className={styles.PolicyBox}
            {...register("policy", { required: true })}
          />
          <label htmlFor="policy" className={styles.policytext}>
            By creating an account, you agree to
            <Link to={""} className={styles.span}>
              {" "}
              SafeSpace's Terms of Use
            </Link>{" "}
            and
            <Link to={""} className={styles.span}>
              {" "}
              Privacy Policy
            </Link>
          </label>
          {getErrorMessage(errors.policy) && (
            <p className={styles.error}>You must agree before continuing</p>
          )}
        </div>

        <Button
          text={loading ? "Creating Account..." : "Create Your Account"}
          type="submit"
        />
      </form>

      <TheFooter />
      <SocialAuth />

      <div className={styles.buttomText}>
        <p>
          Already have an Account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signupform;
