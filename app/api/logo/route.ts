import { NextRequest, NextResponse } from "next/server";
import { load } from "cheerio";

interface LogoSearchResult {
  logoUrl: string | null;
  domain: string | null;
  source: string;
}

/**
 * Advanced Logo Fetching API Route
 * Scrapes company websites to find logos when standard APIs fail
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const companyName = searchParams.get("company");
  const domain = searchParams.get("domain");

  if (!companyName && !domain) {
    return NextResponse.json(
      { error: "Company name or domain required" },
      { status: 400 }
    );
  }

  try {
    let targetDomain = domain;

    // If no domain provided, try to discover it
    if (!targetDomain && companyName) {
      targetDomain = await discoverDomain(companyName);
    }

    if (!targetDomain) {
      return NextResponse.json(
        { error: "Could not find company domain", logoUrl: null },
        { status: 404 }
      );
    }

    // Fetch logo from the discovered domain
    const logoUrl = await scrapeLogoFromWebsite(targetDomain);

    const result: LogoSearchResult = {
      logoUrl,
      domain: targetDomain,
      source: logoUrl ? "website-scrape" : "not-found",
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800", // Cache for 24h
      },
    });
  } catch (error) {
    console.error("Logo fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch logo", logoUrl: null },
      { status: 500 }
    );
  }
}

/**
 * Discover company domain from name
 * Uses DuckDuckGo Instant Answer API (free, no rate limits)
 */
async function discoverDomain(companyName: string): Promise<string | null> {
  try {
    // Try DuckDuckGo Instant Answer API first (no API key needed)
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      companyName
    )}&format=json&no_html=1&skip_disambig=1`;

    const response = await fetch(ddgUrl, {
      headers: {
        "User-Agent": "ITWrapped/1.0",
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Check AbstractURL (usually the official website)
      if (data.AbstractURL) {
        const url = new URL(data.AbstractURL);
        return url.hostname;
      }

      // Check related topics for official site
      if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        for (const topic of data.RelatedTopics) {
          if (topic.FirstURL) {
            const url = new URL(topic.FirstURL);
            if (!url.hostname.includes("wikipedia")) {
              return url.hostname;
            }
          }
        }
      }
    }

    // Fallback: try common patterns
    return guessCommonDomain(companyName);
  } catch (error) {
    console.error("Domain discovery error:", error);
    return guessCommonDomain(companyName);
  }
}

/**
 * Guess common domain patterns
 */
function guessCommonDomain(companyName: string): string | null {
  const cleaned = companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "");

  // Remove common words
  const withoutCommon = cleaned
    .replace(/limited|ltd|plc|inc|corp|company|group|bank|nigeria|ng/g, "")
    .trim();

  if (withoutCommon.length > 0) {
    return `${withoutCommon}.com`;
  }

  return `${cleaned}.com`;
}

/**
 * Scrape logo from company website
 */
async function scrapeLogoFromWebsite(domain: string): Promise<string | null> {
  try {
    // Ensure domain has protocol
    const url = domain.startsWith("http") ? domain : `https://${domain}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const $ = load(html);

    // Priority 1: Open Graph image (often the logo or main brand image)
    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage) {
      return resolveUrl(ogImage, url);
    }

    // Priority 2: Look for images with "logo" in src or alt
    const logoImages = $("img")
      .filter((_index: number, el: any) => {
        const src = $(el).attr("src") || "";
        const alt = $(el).attr("alt") || "";
        const className = $(el).attr("class") || "";

        return (
          src.toLowerCase().includes("logo") ||
          alt.toLowerCase().includes("logo") ||
          className.toLowerCase().includes("logo")
        );
      })
      .first();

    if (logoImages.length > 0) {
      const logoSrc = logoImages.attr("src");
      if (logoSrc) {
        return resolveUrl(logoSrc, url);
      }
    }

    // Priority 3: Common logo CSS classes/IDs
    const logoSelectors = [
      ".logo img",
      "#logo img",
      ".site-logo img",
      ".brand img",
      ".navbar-brand img",
      ".header-logo img",
      "[class*='logo'] img",
      "header img[alt*='logo' i]",
      "a[class*='logo'] img",
    ];

    for (const selector of logoSelectors) {
      const img = $(selector).first();
      if (img.length > 0) {
        const src = img.attr("src");
        if (src) {
          return resolveUrl(src, url);
        }
      }
    }

    // Priority 4: Apple touch icon (high quality)
    const appleTouchIcon = $('link[rel="apple-touch-icon"]').attr("href");
    if (appleTouchIcon) {
      return resolveUrl(appleTouchIcon, url);
    }

    // Priority 5: Favicon
    const favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href");
    if (favicon) {
      return resolveUrl(favicon, url);
    }

    // Fallback: standard favicon location
    return resolveUrl("/favicon.ico", url);
  } catch (error) {
    console.error("Website scrape error:", error);
    return null;
  }
}

/**
 * Resolve relative URLs to absolute
 */
function resolveUrl(path: string, baseUrl: string): string {
  if (path.startsWith("http")) {
    return path;
  }

  try {
    const base = new URL(baseUrl);
    if (path.startsWith("//")) {
      return `${base.protocol}${path}`;
    }
    if (path.startsWith("/")) {
      return `${base.protocol}//${base.host}${path}`;
    }
    return new URL(path, baseUrl).href;
  } catch {
    return path;
  }
}
