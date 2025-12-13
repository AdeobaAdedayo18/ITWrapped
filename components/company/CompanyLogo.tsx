"use client";

import { useState, useEffect } from "react";
import { Company } from "@/lib/types/internship";
import { getCompanyLogo, preloadLogo, extractCompanyDomain } from "@/lib/services/logoService";
import { Building2 } from "lucide-react";
import Image from "next/image";

interface CompanyLogoProps {
  company: Company;
  size?: 48 | 80 | 120;
  className?: string;
}

export function CompanyLogo({ company, size = 48, className = "" }: CompanyLogoProps) {
  const [logoState, setLogoState] = useState<{
    loading: boolean;
    error: boolean;
    url: string;
    initials: string;
  }>({
    loading: true,
    error: false,
    url: "",
    initials: "",
  });

  useEffect(() => {
    async function loadLogo() {
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

      // Try to load the logo
      const loaded = await preloadLogo(result.url);

      if (loaded) {
        setLogoState({
          loading: false,
          error: false,
          url: result.url,
          initials: result.initials || "",
        });
      } else {
        // Logo failed, try brandfetch
        const domain = extractCompanyDomain(company);
        if (domain) {
          const brandfetchUrl = `https://img.brandfetch.io/${domain}/w/400/h/400`;
          const brandfetchLoaded = await preloadLogo(brandfetchUrl);

          if (brandfetchLoaded) {
            setLogoState({
              loading: false,
              error: false,
              url: brandfetchUrl,
              initials: result.initials || "",
            });
            return;
          }
        }

        // All failed, use initials
        setLogoState({
          loading: false,
          error: true,
          url: "",
          initials: result.initials || "",
        });
      }
    }

    loadLogo();
  }, [company, size]);

  const containerSize = size;
  const fontSize = size === 48 ? "text-lg" : size === 80 ? "text-2xl" : "text-4xl";

  // Loading state
  if (logoState.loading) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-muted animate-pulse ${className}`}
        style={{ width: containerSize, height: containerSize }}
      >
        <Building2 className="w-1/2 h-1/2 text-muted-foreground opacity-50" />
      </div>
    );
  }

  // Show logo if available
  if (logoState.url && !logoState.error) {
    return (
      <div
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
      className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/80 to-primary border-2 border-primary/20 ${className}`}
      style={{ width: containerSize, height: containerSize }}
    >
      <span className={`font-black text-white ${fontSize}`}>
        {logoState.initials}
      </span>
    </div>
  );
}
