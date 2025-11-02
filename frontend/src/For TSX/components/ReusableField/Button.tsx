import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset"; // HTML types
  disabled?: boolean; // optional disable support
  onClick?: () => void;
  className?: string;
}

const Button = ({
  text,
  type = "button",
  disabled = false,
  onClick,
  className
}: ButtonProps) => {
  return (
    <div className={styles.buttoncontainer}>
      <button
        type={type}
        className={`${styles.ButtonDesign} ${className || ""}`}
        disabled={disabled} //  disable when form invalid
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
