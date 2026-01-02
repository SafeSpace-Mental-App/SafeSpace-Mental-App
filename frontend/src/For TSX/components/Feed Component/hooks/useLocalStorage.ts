import { useState, useCallback } from "react";

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        return initialValue instanceof Set ? new Set(parsed) : parsed;
      }
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        setValue((prev) => {
          const updated = typeof newValue === "function" ? (newValue as any)(prev) : newValue;
          const toStore = updated instanceof Set ? Array.from(updated) : updated;
          localStorage.setItem(key, JSON.stringify(toStore));
          return updated;
        });
      } catch {
        //empty
        }
    },
    [key]
  );

  return [value, setStoredValue] as const;
};