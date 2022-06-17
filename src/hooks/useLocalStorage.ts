import { useCallback, useEffect, useState } from "react";

const stringify = <T = any>(value: T) => JSON.stringify(value);

const parse = <T>(value: string | null) => {
  try {
    return JSON.parse(value || "null") as T;
  } catch {
    return value;
  }
};

export default function useLocalStorage<T = any>(key: string, initialValue: T) {
  const [value, setValue] = useState<T | string | null>(
    parse(localStorage.getItem(key))
  );
  useEffect(() => {
    if (!value) {
      localStorage.setItem(key, stringify(initialValue));
      setValue(initialValue);
    }
  }, []);

  const setStorage = useCallback((val: T | null) => {
    setValue(val);
    localStorage.setItem(key, stringify(val));
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(key);
    setValue(null);
  }, []);

  return [value, setStorage, clear];
}
