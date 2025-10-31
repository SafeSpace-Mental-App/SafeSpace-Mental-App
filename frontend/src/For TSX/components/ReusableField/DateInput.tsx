import { useState } from "react";
import styles from "./DateInput.module.css";

interface DateInputProps {
  label: string;
  required?: boolean;
}

export default function DateInput({ label, required }: DateInputProps) {
  const [hasValue, setHasValue] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={styles.inputWrapper}>
      <input
        type="date"
        className={styles.input}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value !== "");
        }}
        onChange={(e) => setHasValue(e.target.value !== "")}
      />

      {(!hasValue && !isFocused) && (
        <label className={styles.floatingLabel}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
    </div>
  );
}
