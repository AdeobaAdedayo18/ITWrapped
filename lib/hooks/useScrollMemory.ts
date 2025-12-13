"use client";

import { useEffect, useCallback } from "react";

const STORAGE_KEY = "company-scroll-state";

interface ScrollState {
  scrollPosition: number;
  displayedCount: number;
  timestamp: number;
}

const MAX_AGE = 30 * 60 * 1000; // 30 minutes

export function useScrollMemory(currentCount: number) {
  // Save scroll state
  const saveScrollState = useCallback(
    (count: number) => {
      try {
        const state: ScrollState = {
          scrollPosition: window.scrollY,
          displayedCount: count,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save scroll state:", error);
      }
    },
    []
  );

  // Load scroll state
  const loadScrollState = useCallback((): ScrollState | null => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const state: ScrollState = JSON.parse(saved);
      const age = Date.now() - state.timestamp;

      // Invalidate old state
      if (age > MAX_AGE) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return state;
    } catch (error) {
      console.error("Failed to load scroll state:", error);
      return null;
    }
  }, []);

  // Clear scroll state
  const clearScrollState = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear scroll state:", error);
    }
  }, []);

  // Auto-save on count change
  useEffect(() => {
    if (currentCount > 0) {
      saveScrollState(currentCount);
    }
  }, [currentCount, saveScrollState]);

  // Auto-save on scroll (debounced for performance)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (currentCount > 0) {
          saveScrollState(currentCount);
        }
      }, 150); // Debounce 150ms
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentCount, saveScrollState]);

  return {
    saveScrollState,
    loadScrollState,
    clearScrollState,
  };
}
