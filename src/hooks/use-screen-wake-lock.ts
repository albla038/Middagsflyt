import { useCallback, useEffect, useRef, useState } from "react";

export default function useScreenWakeLock() {
  const [isLocked, setIsLocked] = useState(false);
  const wakeLock = useRef<WakeLockSentinel>(null);

  const toggleWakeLock = useCallback(async () => {
    if (!("wakeLock" in navigator)) {
      console.error("Screen Wake Lock API is not supported in this browser.");
      return;
    }

    if (!isLocked) {
      try {
        wakeLock.current = await navigator.wakeLock.request("screen");
        // Add an event listener to handle when the wake lock is released for any reason
        wakeLock.current.addEventListener("release", () => {
          setIsLocked(false);
          wakeLock.current = null;
          console.log("Screen wake lock was released.");
        });

        setIsLocked(true);
        console.log("Screen wake lock is active.");
      } catch (error) {
        console.error("Failed to request wake lock:", error);
        setIsLocked(false);
      }
    } else {
      if (wakeLock.current) {
        wakeLock.current.release(); // This triggers the 'release' event
        // The 'release' event listener will set isLocked to false
      }
    }
  }, [isLocked]);

  // Clean up the wake lock when the component unmounts
  useEffect(() => {
    return () => {
      if (wakeLock.current) {
        wakeLock.current.release();
      }
    };
  }, []);

  return { isLocked, toggleWakeLock };
}
