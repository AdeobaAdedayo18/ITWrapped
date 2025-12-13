/**
 * Data Processor for ITWrapped
 * Aggregates student data into company insights and metrics
 */

import type {
  Student,
  Company,
  DashboardStats,
  IndustryMetric,
  LocationMetric,
} from "../types/internship";
import { detectIndustry, extractCity } from "./csvParser";

/**
 * Aggregate students into companies
 */
export function aggregateCompanies(students: Student[]): Company[] {
  const companyMap = new Map<string, Company>();

  for (const student of students) {
    if (!student.hasInternship) continue;

    const companyId = student.companyId;

    if (!companyMap.has(companyId)) {
      companyMap.set(companyId, {
        id: companyId,
        name: student.companyName,
        nameVariations: [student.companyName],
        address: student.companyAddress,
        city: extractCity(student.companyAddress),
        state: extractState(student.companyAddress),
        internCount: 0,
        studentIds: [],
        industry: detectIndustry(student.companyName),
        tags: [],
      });
    }

    const company = companyMap.get(companyId)!;
    company.internCount++;
    company.studentIds.push(student.id);

    // Track name variations
    if (!company.nameVariations.includes(student.companyName)) {
      company.nameVariations.push(student.companyName);
    }
  }

  // Convert to array and rank
  const companies = Array.from(companyMap.values());
  return rankCompanies(companies);
}

/**
 * Extract state from address
 */
function extractState(address: string): string {
  if (!address) return "Lagos";

  const statePatterns: Record<string, RegExp> = {
    Lagos: /Lagos/i,
    Abuja: /Abuja|FCT/i,
    Rivers: /Rivers|Port Harcourt/i,
    Oyo: /Oyo|Ibadan/i,
    Kaduna: /Kaduna/i,
    Delta: /Delta|Warri/i,
    Ogun: /Ogun|Abeokuta/i,
  };

  for (const [state, pattern] of Object.entries(statePatterns)) {
    if (pattern.test(address)) {
      return state;
    }
  }

  return "Lagos";
}

/**
 * Rank companies by intern count
 */
function rankCompanies(companies: Company[]): Company[] {
  return companies
    .sort((a, b) => {
      // Primary: intern count
      if (b.internCount !== a.internCount) {
        return b.internCount - a.internCount;
      }
      // Secondary: name alphabetically
      return a.name.localeCompare(b.name);
    })
    .map((company, index) => {
      let badge: "popular" | "validated" | "emerging" = "emerging";
      if (company.internCount >= 5) badge = "popular";
      else if (company.internCount >= 2) badge = "validated";

      return {
        ...company,
        rank: index + 1,
        badge,
        tags: generateTags(company),
      };
    });
}

/**
 * Generate tags for company
 */
function generateTags(company: Company): string[] {
  const tags: string[] = [];

  // Location tag
  tags.push(company.city);

  // Industry tag
  tags.push(company.industry);

  // Popularity tag
  if (company.internCount >= 5) tags.push("Popular");
  else if (company.internCount >= 2) tags.push("Validated");

  return tags;
}

/**
 * Calculate dashboard statistics
 */
export function calculateDashboardStats(
  students: Student[],
  companies: Company[]
): DashboardStats {
  const studentsWithInternship = students.filter((s) => s.hasInternship);

  const industryCount = new Map<string, number>();
  const cityCount = new Map<string, number>();

  for (const company of companies) {
    industryCount.set(
      company.industry,
      (industryCount.get(company.industry) || 0) + company.internCount
    );
    cityCount.set(company.city, (cityCount.get(company.city) || 0) + company.internCount);
  }

  const topIndustry = Array.from(industryCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "IT & Consulting";
  const topCity = Array.from(cityCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "Lagos";
  const mostPopularCompany = companies[0]?.name || "N/A";

  return {
    totalStudents: studentsWithInternship.length,
    totalCompanies: companies.length,
    averageInternsPerCompany: companies.length > 0 ? studentsWithInternship.length / companies.length : 0,
    topIndustry,
    topCity,
    mostPopularCompany,
  };
}

/**
 * Calculate industry metrics
 */
export function calculateIndustryMetrics(companies: Company[]): IndustryMetric[] {
  const industryMap = new Map<string, { count: number; companies: string[] }>();

  for (const company of companies) {
    if (!industryMap.has(company.industry)) {
      industryMap.set(company.industry, { count: 0, companies: [] });
    }
    const data = industryMap.get(company.industry)!;
    data.count += company.internCount;
    data.companies.push(company.name);
  }

  const totalInterns = Array.from(industryMap.values()).reduce((sum, d) => sum + d.count, 0);

  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--brand-gold))",
    "hsl(var(--brand-neon))",
    "hsl(var(--accent))",
    "hsl(var(--muted))",
  ];

  return Array.from(industryMap.entries())
    .map(([industry, data], index) => ({
      name: industry,
      count: data.count,
      percentage: (data.count / totalInterns) * 100,
      topCompanies: data.companies.slice(0, 3),
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Calculate location metrics
 */
export function calculateLocationMetrics(companies: Company[]): LocationMetric[] {
  const locationMap = new Map<string, { state: string; count: number; companies: Set<string> }>();

  for (const company of companies) {
    if (!locationMap.has(company.city)) {
      locationMap.set(company.city, {
        state: company.state,
        count: 0,
        companies: new Set(),
      });
    }
    const data = locationMap.get(company.city)!;
    data.count += company.internCount;
    data.companies.add(company.name);
  }

  return Array.from(locationMap.entries())
    .map(([city, data]) => ({
      city,
      state: data.state,
      count: data.count,
      topCompanies: Array.from(data.companies).slice(0, 3),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Search and filter students
 */
export function searchStudents(students: Student[], query: string): Student[] {
  if (!query || query.trim() === "") return students;

  const q = query.toLowerCase();

  return students
    .filter(
      (student) =>
        student.name.toLowerCase().includes(q) ||
        student.companyName.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        student.matricNo.toLowerCase().includes(q)
    )
    .sort((a, b) => {
      // Prioritize exact matches
      const aNameMatch = a.name.toLowerCase().startsWith(q);
      const bNameMatch = b.name.toLowerCase().startsWith(q);
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      return 0;
    });
}

/**
 * Filter companies by criteria
 */
export function filterCompanies(
  companies: Company[],
  filters: {
    industry?: string;
    city?: string;
    minInterns?: number;
  }
): Company[] {
  return companies.filter((company) => {
    if (filters.industry && company.industry !== filters.industry) return false;
    if (filters.city && company.city !== filters.city) return false;
    if (filters.minInterns && company.internCount < filters.minInterns) return false;
    return true;
  });
}
