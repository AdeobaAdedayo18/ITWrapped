"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LogoCacheEntry {
  url: string;
  source: string;
  initials: string;
}

interface LogoCacheContextType {
  getFromCache: (companyName: string) => LogoCacheEntry | null;
  setInCache: (companyName: string, entry: LogoCacheEntry) => void;
  isLoading: boolean;
  cacheSize: number;
}

const LogoCacheContext = createContext<LogoCacheContextType | undefined>(
  undefined
);

export function LogoCacheProvider({ children }: { children: React.ReactNode }) {
  const [cache, setCache] = useState<Map<string, LogoCacheEntry>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Load cache from persistent storage on mount
  useEffect(() => {
    async function loadCache() {
      try {
        const response = await fetch("/api/logo-cache/bulk");
        if (response.ok) {
          const data = await response.json();
          const newCache = new Map<string, LogoCacheEntry>();

          // Index by normalized company name for fast lookups
          Object.entries(data.cache || {}).forEach(([name, entry]) => {
            const normalized = name.toLowerCase().trim();
            const cacheEntry = entry as LogoCacheEntry;
            newCache.set(normalized, {
              url: cacheEntry.url,
              source: cacheEntry.source,
              initials: cacheEntry.initials || "",
            });
          });

          setCache(newCache);
        }
      } catch (error) {
        console.error("Failed to load logo cache:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCache();
  }, []);

  const getFromCache = (companyName: string): LogoCacheEntry | null => {
    const normalized = companyName.toLowerCase().trim();
    return cache.get(normalized) || null;
  };

  const setInCache = (companyName: string, entry: LogoCacheEntry) => {
    const normalized = companyName.toLowerCase().trim();
    setCache((prev) => {
      const newCache = new Map(prev);
      newCache.set(normalized, entry);
      return newCache;
    });

    // Persist to file asynchronously (fire and forget)
    fetch("/api/logo-cache", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: normalized,
        logoUrl: entry.url,
        source: entry.source,
        initials: entry.initials,
      }),
    }).catch((err) => console.error("Failed to persist cache:", err));
  };

  return (
    <LogoCacheContext.Provider
      value={{
        getFromCache,
        setInCache,
        isLoading,
        cacheSize: cache.size,
      }}
    >
      {children}
    </LogoCacheContext.Provider>
  );
}

export function useLogoCache() {
  const context = useContext(LogoCacheContext);
  if (!context) {
    throw new Error("useLogoCache must be used within LogoCacheProvider");
  }
  return context;
}
