import { useState } from "react";
import styles from "./InputField.module.css";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import type {
  UseFormRegister,
  FieldValues,
  RegisterOptions,
  FieldError,
  FieldErrorsImpl,
  Merge,
  Path,
} from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  label: string;
  type?: string;
  required?: boolean;
  name: keyof T;
  register: UseFormRegister<T>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  validationRules?: RegisterOptions<T, Path<T>>;
}

export default function InputField<T extends FieldValues>({
  label,
  type = "text",
  required = false,
  register,
  name,
  validationRules = {},
}: InputFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === "password";

  // ✅ fix: properly type rules to RegisterOptions<T, Path<T>>
  const rules: RegisterOptions<T, Path<T>> = {
    required,
    ...(validationRules as RegisterOptions<T, Path<T>>),
  };

  return (
    <div className={styles.inputWrapper}>
      {isPassword && focused && (
        <FiLock
          {...({
            className: styles.inputIcon,
          } as React.SVGProps<SVGSVGElement>)}
        />
      )}

      <input
        {...register(name as Path<T>, rules)} // ✅ correct type casting
        type={isPassword && showPassword ? "text" : type}
        className={styles.input}
        placeholder=""
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== "")}
      />

      <label className={styles.floatingLabel}>
        {label}{" "}
        {required && <span className={styles.requiredAstericks}>*</span>}
      </label>

      {isPassword && (
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <FiEye color="var(--text-secondary)" size={18} />
          ) : (
            <FiEyeOff color="var(--text-secondary)" size={18} />
          )}
        </button>
      )}
    </div>
  );
}
