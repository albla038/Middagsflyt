"use client";

import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react";

// Custom hook to use localStorage with a key and initial value
// Behaves like useState, but persists data to localStorage and reads from it on mount
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(initialValue);
  const isFirstRender = useRef(true);

  // Read data from localStorage on mount (if it exists)
  useEffect(() => {
    try {
      const jsonData = localStorage.getItem(key);
      if (jsonData) {
        const parsedValue = JSON.parse(jsonData) as T;
        setValue(parsedValue);
      }
    } catch (error) {
      console.error(
        `Could not get localStorage value with key: ${key}. Error: ${error}`,
      );
    }
  }, [key]);

  // Write to localStorage when state changes
  useEffect(() => {
    // Skip the first write on mount to prevent overwriting existing data with initialValue
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(
        `Could not set localStorage value with key: ${key}. Error: ${error}`,
      );
    }
  }, [key, value]);

  // Return getter and setter with useState-like API
  return [value, setValue];
}
