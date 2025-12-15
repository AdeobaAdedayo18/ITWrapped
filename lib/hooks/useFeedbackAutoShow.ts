"use client";

import { useEffect, useState, useRef } from "react";

const STORAGE_KEY = "itwrapped_feedback_auto_shown";
const AUTO_SHOW_DELAY = 2 * 60 * 1000; // 2 minutes in milliseconds
const EXPIRY_DURATION = 14 * 24 * 60 * 60 * 1000; // 2 weeks in milliseconds

interface StorageData {
  shown: boolean;
  timestamp: number;
}

/**
 * Hook to manage auto-showing the feedback modal after 2 minutes
 * - Starts timer immediately when component mounts
 * - Persists across navigation within the same session
 * - Uses localStorage with 2-week expiry
 * - Only auto-shows once per user (until expiry)
 */
export function useFeedbackAutoShow() {
  const [shouldAutoShow, setShouldAutoShow] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasCheckedStorage = useRef(false);

  useEffect(() => {
    // Avoid hydration issues and duplicate checks
    if (hasCheckedStorage.current) return;
    hasCheckedStorage.current = true;

    try {
      // Check if modal has been auto-shown before
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (stored) {
        try {
          const data: StorageData = JSON.parse(stored);
          const now = Date.now();
          const timeSinceShown = now - data.timestamp;

          // Check if the entry has expired (2 weeks)
          if (timeSinceShown < EXPIRY_DURATION) {
            // Still within expiry period, don't auto-show
            return;
          } else {
            // Expired, remove old entry and proceed to set timer
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (parseError) {
          // Invalid JSON, remove corrupted entry
          console.warn("Invalid feedback storage data, clearing:", parseError);
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // Set up timer to auto-show modal after 2 minutes
      timerRef.current = setTimeout(() => {
        setShouldAutoShow(true);
      }, AUTO_SHOW_DELAY);

    } catch (error) {
      // Handle localStorage errors gracefully (e.g., disabled, quota exceeded)
      console.error("Failed to access localStorage for feedback auto-show:", error);
    }

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  /**
   * Mark that the modal has been auto-shown
   * Call this when the modal is actually opened via auto-show
   */
  const markAsShown = () => {
    try {
      const data: StorageData = {
        shown: true,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setShouldAutoShow(false);
    } catch (error) {
      console.error("Failed to save feedback auto-show state:", error);
    }
  };

  /**
   * Reset the auto-show flag (for testing/debugging)
   */
  const resetAutoShow = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setShouldAutoShow(false);
      hasCheckedStorage.current = false;
    } catch (error) {
      console.error("Failed to reset feedback auto-show state:", error);
    }
  };

  return {
    shouldAutoShow,
    markAsShown,
    resetAutoShow,
  };
}
