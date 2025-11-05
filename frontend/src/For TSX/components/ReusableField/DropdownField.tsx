import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./DropdownField.module.css";
import type { UseFormRegister, FieldValues } from "react-hook-form";

interface DropdownFieldProps<T extends FieldValues> {
  label: string;
  name: keyof T;
  options?: string[];
  required?: boolean;
  api?: boolean;
  register: UseFormRegister<T>;
}

export default function DropdownField<T extends FieldValues>({
  label,
  name,
  options = [],
  required,
  api = false,
  register,
}: DropdownFieldProps<T>) {
  const [apiOptions, setApiOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (api) {
      const fetchCountries = async () => {
        try {
          const res = await fetch("https://restcountries.com/v3.1/all?fields=name");
          const data = await res.json();
          const countryNames = data
            .map((c: any) => c.name.common)
            .sort((a: string, b: string) => a.localeCompare(b));
          setApiOptions(countryNames);
          console.log("✅ Countries loaded:", countryNames.length);
        } catch (err) {
          console.error("❌ Error fetching countries:", err);
        }
      };
      fetchCountries();
    }
  }, [api]);

  const finalOptions = api ? apiOptions : options;

  return (
    <div className={styles.dropdownWrapper}>
      <select
        {...register(name as any, { required })}
        className={styles.select}
        required={required}
        onChange={(e) => setSelected(e.target.value !== "")}
      >
        <option value=""></option>
        {finalOptions.map((opt, index) => (
          <option key={index} value={opt.toLowerCase()}>
            {opt}
          </option>
        ))}
      </select>

      {!selected && (
        <label className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <FiChevronDown className={styles.dropdownIcon} />
    </div>
  );
}
