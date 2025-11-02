import { useState } from "react";
import styles from "./DateInput.module.css";
import type { UseFormRegister, FieldValues } from "react-hook-form";

interface DateInputProps<T extends FieldValues> {
  label: string;
  required?: boolean;
  register: UseFormRegister<T>;
  name: keyof T;
}

export default function DateInput<T extends FieldValues>({
  label,
  required,
  register,
  name,
}: DateInputProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className={styles.inputWrapper}>
      <input
        type="date"
        className={styles.input}
        required={required}
        {...register(name, {
          required,
          onChange: (e) => setHasValue(e.target.value !== ""),
        })}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value !== "");
        }}
      />

      {(!hasValue && !isFocused) && (
        <label className={styles.floatingLabel}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
    </div>
  );
}
