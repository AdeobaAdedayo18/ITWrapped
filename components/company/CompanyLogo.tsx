"use client";

import { useState, useEffect } from "react";
import { Company } from "@/lib/types/internship";
import {
  getCompanyLogo,
  preloadLogo,
  extractCompanyDomain,
  getCompanyInitials,
} from "@/lib/services/logoService";
import { useLogoCache } from "@/components/LogoCacheProvider";
import { Building2 } from "lucide-react";
import Image from "next/image";

interface CompanyLogoProps {
  company: Company;
  size?: 48 | 80 | 120;
  className?: string;
}

export function CompanyLogo({
  company,
  size = 48,
  className = "",
}: CompanyLogoProps) {
  const { getFromCache, setInCache, isLoading: cacheLoading } = useLogoCache();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useState<HTMLDivElement | null>(null);
  const [logoState, setLogoState] = useState<{
    loading: boolean;
    error: boolean;
    url: string;
    initials: string;
  }>({
    loading: true,
    error: false,
    url: "",
    initials: getCompanyInitials(company.name), // Show initials immediately
  });

  // Intersection Observer for lazy loading
  useEffect(() => {
    const [container] = containerRef;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only need to observe once
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before visible
        threshold: 0,
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    // Only start loading when visible and cache is ready
    if (!isVisible || cacheLoading) return;

    async function loadLogo() {
      // STEP 1: Check in-memory cache (instant, no network)
      const cached = getFromCache(company.name);
      if (cached && cached.url) {
        setLogoState({
          loading: false,
          error: false,
          url: cached.url,
          initials: cached.initials || getCompanyInitials(company.name),
        });
        return;
      }

      // STEP 2: Try standard logo services
      const result = getCompanyLogo(company, size);

      // If no URL (immediate fallback), show initials
      if (!result.url) {
        setLogoState({
          loading: false,
          error: false,
          url: "",
          initials: result.initials || "",
        });
        return;
      }

      // Try to load the logo from Clearbit
      const loaded = await preloadLogo(result.url);

      if (loaded) {
        // Store in cache
        setInCache(company.name, {
          url: result.url,
          source: "clearbit",
          initials: result.initials || "",
        });
        setLogoState({
          loading: false,
          error: false,
          url: result.url,
          initials: result.initials || "",
        });
        return;
      }

      // Clearbit failed, try Brandfetch
      const domain = extractCompanyDomain(company);
      if (domain) {
        const brandfetchUrl = `https://img.brandfetch.io/${domain}/w/400/h/400`;
        const brandfetchLoaded = await preloadLogo(brandfetchUrl);

        if (brandfetchLoaded) {
          // Store in cache
          setInCache(company.name, {
            url: brandfetchUrl,
            source: "brandfetch",
            initials: result.initials || "",
          });
          setLogoState({
            loading: false,
            error: false,
            url: brandfetchUrl,
            initials: result.initials || "",
          });
          return;
        }
      }

      // Brandfetch failed, try advanced scraping for all companies
      try {
        const { getAdvancedLogo } = await import("@/lib/services/logoService");
        const advancedLogoUrl = await getAdvancedLogo(company);

        if (advancedLogoUrl) {
          const advancedLoaded = await preloadLogo(advancedLogoUrl);
          if (advancedLoaded) {
            // Store in cache (already persisted by getAdvancedLogo)
            setInCache(company.name, {
              url: advancedLogoUrl,
              source: "advanced-scrape",
              initials: result.initials || "",
            });
            setLogoState({
              loading: false,
              error: false,
              url: advancedLogoUrl,
              initials: result.initials || "",
            });
            return;
          }
        }
      } catch (error) {
        console.error("Advanced logo fetch failed:", error);
      }

      // All sources failed, use initials
      setLogoState({
        loading: false,
        error: true,
        url: "",
        initials: result.initials || "",
      });
    }

    loadLogo();
  }, [company, size, isVisible, cacheLoading, getFromCache, setInCache]);

  const containerSize = size;
  const fontSize =
    size === 48 ? "text-lg" : size === 80 ? "text-2xl" : "text-4xl";

  // Loading state (show initials while loading)
  if (logoState.loading && !logoState.initials) {
    return (
      <div
        ref={(el) => {
          containerRef[0] = el;
        }}
        className={`flex items-center justify-center rounded-lg bg-muted animate-pulse ${className}`}
        style={{ width: containerSize, height: containerSize }}
      >
        <Building2 className="w-1/2 h-1/2 text-muted-foreground opacity-50" />
      </div>
    );
  }

  // Show initials immediately while logo loads (lazy loading)
  if (logoState.loading && logoState.initials && !logoState.url) {
    return (
      <div
        ref={(el) => {
          containerRef[0] = el;
        }}
        className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/60 to-primary/40 border-2 border-primary/10 ${className}`}
        style={{ width: containerSize, height: containerSize }}
      >
        <span className={`font-black text-white/90 ${fontSize}`}>
          {logoState.initials}
        </span>
      </div>
    );
  }

  // Show logo if available
  if (logoState.url && !logoState.error) {
    return (
      <div
        ref={(el) => {
          containerRef[0] = el;
        }}
        className={`relative flex items-center justify-center rounded-lg bg-white border-2 border-muted overflow-hidden ${className}`}
        style={{ width: containerSize, height: containerSize }}
      >
        <Image
          src={logoState.url}
          alt={`${company.name} logo`}
          width={containerSize}
          height={containerSize}
          className="object-contain p-2"
          loading="lazy"
          onError={() => {
            // If image fails to load, show initials
            setLogoState((prev) => ({ ...prev, error: true }));
          }}
        />
      </div>
    );
  }

  // Fallback: Show initials
  return (
    <div
      ref={(el) => {
        containerRef[0] = el;
      }}
      className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/80 to-primary border-2 border-primary/20 ${className}`}
      style={{ width: containerSize, height: containerSize }}
    >
      <span className={`font-black text-white ${fontSize}`}>
        {logoState.initials}
      </span>
    </div>
  );
}
