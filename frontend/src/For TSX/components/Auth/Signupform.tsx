// VALIDATE VERSION

import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

import styles from "./Signupform.module.css";
import InputField from "../ReusableField/InputField";
import DropdownField from "../ReusableField/Dropdownfield";
import DateInput from "../ReusableField/DateInput";
import Button from "../ReusableField/Button";
import TheFooter from "../ReusableField/TheFooter";
import SocialAuth from "../ReusableField/SocialAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

// 👇🏽 React Hook Form import
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

// type SignupFormInputs = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   dob: string;
//   gender: string;
//   country: string;
//   password: string;
//   confirmPassword: string;
//   policy: boolean;
// };

const Signupform = () => {
  // 👇🏽 Initialize the form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // HADLING SUBMIT
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      console.log('submission successful', data)
      setLoading(true);
      const response = await axiosInstance.post("/signup", data);
      console.log("✅ Signup successful:", response.data);
      navigate("/verify-email", {
        state: { email: data.email, username: data.username },
      });
    } catch (error: any) {
      console.error("❌ Signup failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const password = watch("password"); // 👈 watches the password field

  return (
    <>
      <div className={styles.Signupconatiner}>
        <header className={styles.signuptop}>
        <IoIosArrowBack className={styles.backIcon} size={24} />

          <h1 className={styles.title}> Anonymous Thoughts 🌟</h1>
        </header>
        <p className={styles.subtitles}>
          Got something on your mind you need to get off anonymously? Create
          Your Account
        </p>

        <div>
          {/* 👇🏽 handleSubmit wrapper */}
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
              error={errors.email}
              validationRules={{
                // required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              }}
            />
            {errors.email && (
              <p className={styles.errorText}>{errors.email.message}</p>
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
            {errors.phone && (
              <p className={styles.errorText}>{errors.phone.message}</p>
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
            {errors.password && (
              <p className={styles.errorText}>{errors.password.message}</p>
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
            {/* Error message */}
            {errors.confirmPassword && (
              <p className={styles.errorText}>
                {errors.confirmPassword.message}
              </p>
            )}

            <div className={styles.passwordHint}>
              <FiInfo className={styles.hintIcon} />
              <p className={styles.PasswordTextHint}>
                Your password must be at least 8 characters long and include a
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
              {errors.policy && (
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
              Already have an Account?
              <Link to="/signin">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signupform;
