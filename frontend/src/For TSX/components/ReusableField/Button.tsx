import React from "react";
import styles from "./Button.module.css";
interface buttonprop {
  text: string;
  type?: string
}
const Button = ({ text, type }: buttonprop) => {
  return (
    <div className= {styles.buttoncontainer}>
      <button className={styles.ButtonDesign} >{text}</button>
    </div>
  );
};

export default Button;
