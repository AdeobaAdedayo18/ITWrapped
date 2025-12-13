import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface LogoCacheEntry {
  url: string;
  source: string;
  initials: string;
  timestamp: number;
}

interface LogoCache {
  [companyName: string]: LogoCacheEntry;
}

const CACHE_FILE_PATH = path.join(process.cwd(), "lib/data/logoCache.json");

/**
 * API Route to manage logo cache
 * GET: Retrieve cached logo
 * POST: Store new logo in cache
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyName = searchParams.get("company");

    if (!companyName) {
      return NextResponse.json(
        { error: "Company name required" },
        { status: 400 }
      );
    }

    const cache = await readCache();
    const cached = cache[companyName.toLowerCase()];

    if (cached) {
      return NextResponse.json({
        logoUrl: cached.url,
        source: cached.source,
        cached: true,
      });
    }

    return NextResponse.json({ logoUrl: null, cached: false }, { status: 404 });
  } catch (error) {
    console.error("Cache read error:", error);
    return NextResponse.json(
      { error: "Failed to read cache" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, logoUrl, source, initials } = body;

    if (!companyName || !logoUrl) {
      return NextResponse.json(
        { error: "Company name and logo URL required" },
        { status: 400 }
      );
    }

    const cache = await readCache();
    cache[companyName.toLowerCase()] = {
      url: logoUrl,
      source: source || "unknown",
      initials: initials || "",
      timestamp: Date.now(),
    };

    await writeCache(cache);

    return NextResponse.json({ success: true, cached: true });
  } catch (error) {
    console.error("Cache write error:", error);
    return NextResponse.json(
      { error: "Failed to write cache" },
      { status: 500 }
    );
  }
}

async function readCache(): Promise<LogoCache> {
  try {
    const fileContent = await fs.readFile(CACHE_FILE_PATH, "utf-8");
    const data = JSON.parse(fileContent);
    return data.cache || {};
  } catch {
    // If file doesn't exist or is invalid, return empty cache
    return {};
  }
}

async function writeCache(cache: LogoCache): Promise<void> {
  const data = {
    cache,
    lastUpdated: new Date().toISOString(),
  };
  await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}
