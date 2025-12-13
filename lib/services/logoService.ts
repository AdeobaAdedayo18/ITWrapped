/**
 * Logo Service
 * Handles company logo fetching with multiple fallbacks
 * 1. Clearbit Logo API
 * 2. Brandfetch API
 * 3. Initials fallback
 */

import { Company } from "../types/internship";

/**
 * Get company domain from name or address
 */
export function extractCompanyDomain(company: Company): string | null {
  const name = company.name.toLowerCase();

  // Known company domains mapping
  const knownDomains: Record<string, string> = {
    quidax: "quidax.com",
    "first bank": "firstbanknigeria.com",
    "union bank": "unionbanknig.com",
    uba: "ubagroup.com",
    "united bank for africa": "ubagroup.com",
    interswitch: "interswitchgroup.com",
    cowrywise: "cowrywise.com",
    payaza: "payaza.africa",
    moniepoint: "moniepoint.com",
    fcmb: "fcmb.com",
    "first city monument bank": "fcmb.com",
    wema: "wemabank.com",
    "wema bank": "wemabank.com",
    sterling: "sterlingbankng.com",
    "sterling bank": "sterlingbankng.com",
    kpmg: "kpmg.com",
    pwc: "pwc.com",
    pricewaterhousecoopers: "pwc.com",
    "ernst & young": "ey.com",
    "ernst and young": "ey.com",
    deloitte: "deloitte.com",
    nestle: "nestle.com",
    "nestle nigeria": "nestle-cwa.com",
    huawei: "huawei.com",
    google: "google.com",
    microsoft: "microsoft.com",
    ibm: "ibm.com",
    nnpc: "nnpcgroup.com",
    shell: "shell.com",
    "total energies": "totalenergies.com",
    total: "totalenergies.com",
    mtn: "mtn.com",
    airtel: "airtel.com",
    "9mobile": "9mobile.com",
    glo: "gloworld.com",
    hiit: "hiitplc.com",
    "hiit plc": "hiitplc.com",
    kucheza: "kuchezagaming.com",
    tizeti: "tizeti.com",
    andela: "andela.com",
    flutterwave: "flutterwave.com",
    paystack: "paystack.com",
  };

  // Check known domains first
  for (const [key, domain] of Object.entries(knownDomains)) {
    if (name.includes(key)) {
      return domain;
    }
  }

  // Try to extract domain from company name (basic heuristic)
  // Remove common suffixes
  const cleanName = name
    .replace(/\s+(limited|ltd|plc|inc|corp|corporation|company|co\.|llc|llp)\s*$/i, "")
    .replace(/[^a-z0-9]/g, "");

  if (cleanName) {
    return `${cleanName}.com`; // Guess .com domain
  }

  return null;
}

/**
 * Get logo URL from Clearbit Logo API
 */
export function getClearbitLogoUrl(domain: string, size: number = 80): string {
  // Clearbit Logo API: Free, no auth required
  return `https://logo.clearbit.com/${domain}?size=${size}`;
}

/**
 * Get logo URL from Brandfetch API
 */
export function getBrandfetchLogoUrl(domain: string): string {
  // Brandfetch API: Free tier available
  return `https://img.brandfetch.io/${domain}/w/400/h/400`;
}

/**
 * Generate initials from company name
 */
export function getCompanyInitials(companyName: string): string {
  const words = companyName
    .replace(/[^\w\s]/g, "") // Remove special chars
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "CO";

  // Take first letter of first two words, or first two letters if one word
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Get company logo with fallbacks
 */
export interface LogoResult {
  url: string;
  isFallback: boolean;
  initials?: string;
}

export function getCompanyLogo(company: Company, size: number = 80): LogoResult {
  const domain = extractCompanyDomain(company);

  if (!domain) {
    // No domain found, use initials immediately
    return {
      url: "",
      isFallback: true,
      initials: getCompanyInitials(company.name),
    };
  }

  // Return Clearbit URL with fallback info
  return {
    url: getClearbitLogoUrl(domain, size),
    isFallback: false,
    initials: getCompanyInitials(company.name),
  };
}

/**
 * Preload logo image to check if it exists
 */
export function preloadLogo(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Get fallback logo URL (try Brandfetch)
 */
export function getFallbackLogo(domain: string): string {
  return getBrandfetchLogoUrl(domain);
}
