import React from "react";
import { FaArrowLeft, FaEllipsisH } from "react-icons/fa";
import styles from "./Signinform.module.css";
const Signinform = () => {
  return (
    <>
      <div>
        <h1>Welcome back! 😊</h1>
        <p>
          Let's get back into your safe space where you can breathe, reflect,
          and just be
        </p>
      </div>
      <form action="">
        <label htmlFor="phone">Phone number</label>
        <input type="number" name="phone" id="phone" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <p>Forgot Password</p>
        <button type="submit">Sign in </button>
        <p>
          Don't have an Account? <span>Sign up</span>{" "}
        </p>
      </form>
    </>
  );
};

export default Signinform;
