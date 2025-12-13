import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CACHE_FILE_PATH = path.join(process.cwd(), "lib/data/logoCache.json");

/**
 * GET: Retrieve entire cache for client-side indexing
 */
export async function GET() {
  try {
    const fileContent = await fs.readFile(CACHE_FILE_PATH, "utf-8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(
      { cache: data.cache || {}, lastUpdated: data.lastUpdated },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    // Return empty cache if file doesn't exist
    return NextResponse.json(
      { cache: {}, lastUpdated: null },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600",
        },
      }
    );
  }
}
