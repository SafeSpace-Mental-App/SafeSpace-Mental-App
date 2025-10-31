// import React from "react";
// import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
// import { FiLock, FiInfo } from "react-icons/fi";
// import { IoIosArrowBack } from "react-icons/io";
// import { Link } from "react-router-dom";

// import styles from "./Signupform.module.css";
// import InputField from "../ReusableField/InputField";
// import DropdownField from "../ReusableField/Dropdownfield";
// import DateInput from "../ReusableField/DateInput";
// import Button from "../ReusableField/Button";
// import TheFooter from "../ReusableField/TheFooter";
// import SocialAuth from "../ReusableField/SocialAuth";

// const Signupform = () => {
//   return (
//     <>
//       <div className={styles.Signupconatiner}>
//         <header className={styles.signuptop}>
//           <IoIosArrowBack size={24} />
//           <h1 className={styles.title}> Anonymous Thoughts 🌟</h1>
//         </header>
//         <p className={styles.subtitles}>
//           Got something on your mind you need to get off anonymously? Create
//           Your Account
//         </p>
//         <div>
//           <form action="">
//             <div className={styles.nameRow}>
//               <InputField label="First Name" required />
//               <InputField label="Last Name" required />
//             </div>
//             <InputField label="Email address" type="email" required />

//             <DateInput label="Date of Birth" required />
//             <DropdownField
//               label="Gender"
//               options={["Male", "Female", "Other"]}
//               required
//             />
//             <DropdownField label="Country" api={true} required />

//             <InputField label="Password" type="password" required />
//             <InputField label="Confirm Password" type="password" required />
//             <div className={styles.passwordHint}>
//               <FiInfo className={styles.hintIcon} />
//               <p className={styles.PasswordTextHint}>
//                 Your password must be at least 8 characters long and include a
//                 uppercase letter, a number, and a special character: !@#$
//               </p>
//             </div>
//             <div className={styles.policyContainer}>
//               <input
//                 type="checkbox"
//                 name="policy"
//                 id="policy"
//                 className={styles.PolicyBox}
//               />
//               <label htmlFor="policy" className={styles.policytext}>
//                 By creating an account, you agree to
//                 <span className={styles.span}>
//                   {" "}
//                   SafeSpace's Terms of Use
//                 </span>{" "}
//                 and
//                 <span className={styles.span}> Privacy Policy</span>
//               </label>
//             </div>
//             <Button text="Create Your Account " type="submit" />
//           </form>
//           <TheFooter />
//           <SocialAuth />
//           <div className={styles.buttomText}>
//             <p>
//               Already have an Account?
//               <Link to="/signin">Sign in</Link>

//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Signupform;

// VALIDATE VERSION

import React from "react";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { FiLock, FiInfo } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

import styles from "./Signupform.module.css";
import InputField from "../ReusableField/InputField";
import DropdownField from "../ReusableField/Dropdownfield";
import DateInput from "../ReusableField/DateInput";
import Button from "../ReusableField/Button";
import TheFooter from "../ReusableField/TheFooter";
import SocialAuth from "../ReusableField/SocialAuth";

// 👇🏽 React Hook Form import
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

type SignupFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  gender: string;
  country: string;
  password: string;
  confirmPassword: string;
  policy: boolean;
};

const Signupform = () => {
  // 👇🏽 Initialize the form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit: SubmitHandler<any> = (data) => {
    console.log("✅ Form submitted successfully:", data);
  };

  return (
    <>
      <div className={styles.Signupconatiner}>
        <header className={styles.signuptop}>
          <IoIosArrowBack size={24} />
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
                name="firstName"
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
              label="Email address"
              type="email"
              name="email"
              required
              register={register}
            />

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
              label="Password"
              type="password"
              name="password"
              required
              register={register}
            />
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              required
              register={register}
            />

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
                name="policy"
                id="policy"
                className={styles.PolicyBox}
                {...register("policy", { required: true })}
              />
              <label htmlFor="policy" className={styles.policytext}>
                By creating an account, you agree to
                <span className={styles.span}>
                  {" "}
                  SafeSpace's Terms of Use
                </span>{" "}
                and
                <span className={styles.span}> Privacy Policy</span>
              </label>
              {errors.policy && (
                <p className={styles.error}>You must agree before continuing</p>
              )}
            </div>

            <Button text="Create Your Account " type="submit" />
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
