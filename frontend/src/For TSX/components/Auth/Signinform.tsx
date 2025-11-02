import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import styles from "./Signinform.module.css";
import InputField from "../ReusableField/InputField";
import Button from "../ReusableField/Button";
import TheFooter from "../ReusableField/TheFooter";
import SocialAuth from "../ReusableField/SocialAuth";
import { Link } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

// 👇🏽 React Hook Form import
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

const Signinform = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  //HAANDLING SIGN IN
  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      const response = await axiosInstance.post("/signin", {
        phone: data.phone,
        password: data.password,
      });

      console.log("✅ Login successful:", response.data);
      navigate("/congratulations");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid phone number or password";

      console.error("❌ Login failed:", errorMessage);

      // Show error to user (e.g., setError or toast)
    }
  };

  return (
    <>
      <div className={styles.Signupconatiner}>
        <IoIosArrowBack className={styles.backIcon} size={24} />

        <div>
          <h1 className={styles.title}>Welcome back! 😊</h1>
          <p className={styles.subtitles}>
            Let's get back into your safe space where you can breathe, reflect,
            and just be
          </p>
        </div>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
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

          <p>
            <Link to={""} className={styles.FogetPassword}>
              {" "}
              Forget password?
            </Link>
          </p>
          <Button text="Sign in " type="submit" />
          <div className={styles.buttomText}>
            <p>
              Dont have an Account?<Link to="/signup">Sign Up</Link>
            </p>
          </div>
          <TheFooter />
          <SocialAuth />
        </form>
      </div>
    </>
  );
};

export default Signinform;
