/**
 * CSV Parser for ITWrapped Data
 * Parses the raw CSV file and converts it to structured data
 */

import Papa from "papaparse";
import type { Student } from "../types/internship";

/**
 * Normalize company name to slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/[\s_-]+/g, "-") // Replace spaces with -
    .replace(/^-+|-+$/g, ""); // Trim dashes
}

/**
 * Normalize phone number format
 */
export function normalizePhone(phone: string): string {
  if (!phone) return "";
  // Remove spaces and special chars
  const cleaned = phone.replace(/[^\d]/g, "");
  // Nigerian numbers: ensure it starts with 0 if 10 digits, or keep as is
  if (cleaned.length === 10 && !cleaned.startsWith("0")) {
    return "0" + cleaned;
  }
  return cleaned;
}

/**
 * Extract city from address
 */
export function extractCity(address: string): string {
  if (!address) return "Unknown";

  const cityPatterns = [
    /Lagos/i,
    /Abuja/i,
    /Port Harcourt/i,
    /Ibadan/i,
    /Kaduna/i,
    /Warri/i,
    /Delta/i,
    /Ogun/i,
    /Rivers/i,
    /Akure/i,
  ];

  for (const pattern of cityPatterns) {
    if (pattern.test(address)) {
      const match = address.match(pattern);
      if (match) {
        const city = match[0];
        // Map state names to major cities
        if (city.toLowerCase() === "rivers") return "Port Harcourt";
        if (city.toLowerCase() === "ogun") return "Lagos"; // Proximity
        if (city.toLowerCase() === "delta") return "Warri";
        return city;
      }
    }
  }

  return "Lagos"; // Default assumption
}

/**
 * Detect industry from company name
 */
export function detectIndustry(companyName: string): string {
  const name = companyName.toLowerCase();

  // Fintech
  if (
    name.includes("bank") ||
    name.includes("fintech") ||
    name.includes("payment") ||
    name.includes("cowry") ||
    name.includes("quidax") ||
    name.includes("payaza") ||
    name.includes("moniepoint") ||
    name.includes("credit") ||
    name.includes("microfinance")
  ) {
    return "Banking & Fintech";
  }

  // Tech/IT
  if (
    name.includes("tech") ||
    name.includes("software") ||
    name.includes("systems") ||
    name.includes("digital") ||
    name.includes("innovation") ||
    name.includes("consulting") ||
    name.includes("hiit") ||
    name.includes("interswitch")
  ) {
    return "IT & Consulting";
  }

  // Telecom
  if (
    name.includes("telecom") ||
    name.includes("tizeti") ||
    name.includes("ipnx") ||
    name.includes("network")
  ) {
    return "Telecommunications";
  }

  // Energy
  if (
    name.includes("nnpc") ||
    name.includes("oil") ||
    name.includes("gas") ||
    name.includes("energy") ||
    name.includes("total") ||
    name.includes("petroleum")
  ) {
    return "Energy & Oil/Gas";
  }

  // Government
  if (
    name.includes("faan") ||
    name.includes("nimasa") ||
    name.includes("statistics") ||
    name.includes("authority") ||
    name.includes("federal")
  ) {
    return "Government";
  }

  // Manufacturing
  if (
    name.includes("nestle") ||
    name.includes("tobacco") ||
    name.includes("manufacturing") ||
    name.includes("emzor")
  ) {
    return "Manufacturing";
  }

  // Education
  if (
    name.includes("college") ||
    name.includes("university") ||
    name.includes("niit") ||
    name.includes("sqi") ||
    name.includes("aptech")
  ) {
    return "Education";
  }

  return "Other";
}

/**
 * Parse CSV file to Student array
 */
export async function parseCSV(file: File): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const students = processCSVData(results.data as Record<string, string>[]);
          resolve(students);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

/**
 * Parse CSV from text content
 */
export function parseCSVText(csvText: string): Student[] {
  const results = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return processCSVData(results.data as Record<string, string>[]);
}

/**
 * Process raw CSV data into Student objects
 */
function processCSVData(data: Record<string, string>[]): Student[] {
  const students: Student[] = [];
  const seenMatricNos = new Set<string>();

  for (const row of data) {
    // Get values with various possible column names
    const name = row.NAME || row.name || "";
    const matricNo = row["MATRIC NO"] || row.matricNo || row["MATRIC NO"] || "";
    const regNo = row["REG. NO."] || row.regNo || row["REG. NO."] || "";
    const level = row.LEVEL || row.level || "300";
    const department = row.DEPARTMENT || row.department || "";
    const companyName = row["COMPANY'S NAME"] || row.companyName || row["COMPANY'S NAME"] || "";
    const companyAddress = row["COMPANIES ADDRESS"] || row[" "] || row[""] || "";
    const phone = row["STUDENTS' GSM NO"] || row.phone || row["STUDENTS' GSM NO"] || "";
    const parentPhone = row["PARENT GSM NO."] || row.parentPhone || row["PARENT GSM NO."] || "";
    const email = row["STUDENT EMAIL"] || row.email || row["STUDENT EMAIL"] || "";

    // Skip if no name or duplicate matricNo
    if (!name || !matricNo || seenMatricNos.has(matricNo)) {
      continue;
    }

    seenMatricNos.add(matricNo);

    const hasInternship = !!companyName && companyName.trim() !== "";
    const companyId = hasInternship ? slugify(companyName) : "unassigned";

    const student: Student = {
      id: matricNo,
      name: name.trim(),
      matricNo: matricNo.trim(),
      regNo: regNo.trim(),
      level: parseInt(level) || 300,
      department: department.includes("Computer") ? "Computer Science" : "Computer Science",
      companyId,
      companyName: hasInternship ? companyName.trim() : "Unassigned",
      companyAddress: companyAddress?.trim() || "",
      email: email.trim(),
      phone: normalizePhone(phone),
      parentPhone: normalizePhone(parentPhone),
      hasInternship,
    };

    students.push(student);
  }

  return students;
}
