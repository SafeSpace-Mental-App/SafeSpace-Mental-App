// import { useState } from "react";
// import styles from "./InputField.module.css";
// import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
// import type { UseFormRegister, FieldValues } from "react-hook-form";

// interface InputFieldProps<T extends FieldValues> {
//   label: string;
//   type?: string;
//   required?: boolean;
  // name: keyof T;
  // register: UseFormRegister<T>;

// }

// export default function InputField({
//   label,
//   type = "text",
//   required = false,
// }: InputFieldProps) {
//   const [showPassword, setShowPassword] = useState(false);
//   const isPassword = type === "password";
//   const [focused, setFocused] = useState(false);

//   return (
//     <div className={styles.inputWrapper}>
//       {isPassword && focused && <FiLock className={styles.inputIcon} />}

//       <input
//         type={isPassword && showPassword ? "text" : type}
//         className={styles.input}
//         placeholder=""
//         required={required}
//         onFocus={() => setFocused(true)}
//         onBlur={(e) =>
//           setFocused(e.target.value !== "")
//             ? setFocused(true)
//             : setFocused(false)
//         }
//       />
//       <label className={styles.floatingLabel}>
//         {label} {required && <span className={styles.required}>*</span>}
//       </label>

//       {isPassword && (
//         <button
//           type="button"
//           className={styles.toggleBtn}
//           onClick={() => setShowPassword(!showPassword)}
//         >
//           {showPassword ? (
//             <FiEye color="var(--text-secondary)" size={18} />
//           ) : (
//             <FiEyeOff color="var(--text-secondary)" size={18} />
//           )}
//         </button>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import styles from "./InputField.module.css";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import type { UseFormRegister, FieldValues } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  label: string;
  type?: string;
  required?: boolean;
  name: keyof T;
  register: UseFormRegister<T>;
}

export default function InputField<T extends FieldValues>({
  label,
  type = "text",
  required = false,
  register,
  name,
}: InputFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const [focused, setFocused] = useState(false);

  return (
    <div className={styles.inputWrapper}>
      {isPassword && focused && <FiLock className={styles.inputIcon} />}

      {/* 🧩 FIX: use register, but remove native "required" attr */}
      <input
        {...register(name, { required })}
        type={isPassword && showPassword ? "text" : type}
        className={styles.input}
        placeholder=""
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== "")}
      />

      <label className={styles.floatingLabel}>
        {label} {required && <span className={styles.required}>*</span>}
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
