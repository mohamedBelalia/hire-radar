import { useState, useEffect } from "react";

/**
 * Provides a debounced version of a value that only updates after a specified delay.
 *
 * @param value - The input value to debounce.
 * @param delay - Delay in milliseconds to wait after the last change before updating the returned value.
 * @returns The debounced value that reflects `value` once `delay` milliseconds have passed since the most recent change.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}