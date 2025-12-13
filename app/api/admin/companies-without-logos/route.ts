import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";

interface Company {
  name: string;
  internCount: number;
  currentLogo: string | null;
}

export async function GET() {
  try {
    console.log("📊 [ADMIN] Fetching companies without logos...");

    // Read CSV file
    const csvPath = path.join(process.cwd(), "lib", "data", "CIS IT DETAILS.csv");
    const csvContent = await fs.readFile(csvPath, "utf-8");

    // Parse CSV
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    // Aggregate companies and count interns
    const companyMap = new Map<string, number>();
    
    (parsed.data as Record<string, string>[]).forEach((row) => {
      const companyName = (
        row["COMPANY'S NAME"] ||
        row["COMPANY NAME"] ||
        row["Company Name"] ||
        row["company name"] ||
        row["COMPANY"] ||
        row["Company"] ||
        ""
      ).trim();

      if (companyName && companyName.toLowerCase() !== "n/a" && companyName.toLowerCase() !== "none") {
        companyMap.set(companyName, (companyMap.get(companyName) || 0) + 1);
      }
    });

    console.log(`📈 [ADMIN] Found ${companyMap.size} unique companies`);

    // Read logo cache
    const cachePath = path.join(process.cwd(), "lib", "data", "logoCache.json");
    let logoCache: Record<string, { url: string | null; source?: string; initials?: string }> = {};
    
    try {
      const cacheContent = await fs.readFile(cachePath, "utf-8");
      logoCache = JSON.parse(cacheContent).cache || {};
    } catch {
      console.log("⚠️ [ADMIN] No logo cache found, treating all as missing");
    }

    // Filter companies without logos and sort by popularity
    const companiesWithoutLogos: Company[] = [];

    companyMap.forEach((count, name) => {
      const normalizedName = name.toLowerCase().trim();
      const cacheEntry = logoCache[normalizedName];
      
      // Company needs logo if:
      // 1. Not in cache at all, OR
      // 2. In cache but url is null/empty (fetch failed previously)
      const needsLogo = !cacheEntry || !cacheEntry.url || cacheEntry.url === "null";

      if (needsLogo) {
        companiesWithoutLogos.push({
          name,
          internCount: count,
          currentLogo: cacheEntry?.url || null,
        });
      }
    });

    // Sort by intern count (most popular first)
    companiesWithoutLogos.sort((a, b) => b.internCount - a.internCount);

    console.log(`🎯 [ADMIN] ${companiesWithoutLogos.length} companies need logos`);
    console.log(`🏆 [ADMIN] Top 5: ${companiesWithoutLogos.slice(0, 5).map(c => `${c.name} (${c.internCount})`).join(", ")}`);

    return NextResponse.json({
      success: true,
      companies: companiesWithoutLogos,
      total: companiesWithoutLogos.length,
    });
  } catch (error) {
    console.error("💥 [ADMIN] Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
