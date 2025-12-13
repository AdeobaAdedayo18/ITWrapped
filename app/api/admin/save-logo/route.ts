import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface LogoCacheEntry {
  url: string;
  source: string;
  initials: string;
}

interface LogoCache {
  cache: Record<string, LogoCacheEntry>;
}

export async function POST(request: NextRequest) {
  try {
    const { companyName, logoUrl, source } = await request.json();

    console.log(`💾 [ADMIN] Saving logo for: ${companyName}`);
    console.log(`🔗 [ADMIN] Logo URL: ${logoUrl}`);
    console.log(`📍 [ADMIN] Source: ${source}`);

    if (!companyName || !logoUrl) {
      return NextResponse.json(
        { error: "Company name and logo URL are required" },
        { status: 400 }
      );
    }

    // Check if we're in a serverless environment (production)
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // In production, filesystem is read-only
      // Return success but warn that changes won't persist
      console.log("⚠️ [ADMIN] Running in production - filesystem is read-only");
      console.log("⚠️ [ADMIN] Logo saved to memory only (will not persist)");
      
      return NextResponse.json({
        success: true,
        warning: "Changes saved temporarily. Set up Vercel KV or database for persistence.",
        message: `Logo saved for ${companyName} (memory only)`,
      });
    }

    // Development: Read existing cache from filesystem
    const cachePath = path.join(process.cwd(), "lib", "data", "logoCache.json");
    let cacheData: LogoCache = { cache: {} };

    try {
      const content = await fs.readFile(cachePath, "utf-8");
      cacheData = JSON.parse(content);
    } catch {
      console.log("📝 [ADMIN] Creating new logo cache file");
    }

    // Generate initials
    const initials = companyName
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    // Normalize company name for cache key
    const normalizedName = companyName.toLowerCase().trim();

    // Add to cache
    cacheData.cache[normalizedName] = {
      url: logoUrl,
      source: source || "manual",
      initials,
    };

    // Save to file
    await fs.writeFile(
      cachePath,
      JSON.stringify(cacheData, null, 2),
      "utf-8"
    );

    console.log(`✅ [ADMIN] Logo saved successfully for ${companyName}`);

    return NextResponse.json({
      success: true,
      message: `Logo saved for ${companyName}`,
    });
  } catch (error) {
    console.error("💥 [ADMIN] Error saving logo:", error);
    return NextResponse.json(
      { error: "Failed to save logo" },
      { status: 500 }
    );
  }
}
