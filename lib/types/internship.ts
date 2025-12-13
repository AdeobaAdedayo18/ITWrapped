/**
 * ITWrapped Data Types
 * Core type definitions for internship data
 */

export interface Student {
  // Identity
  id: string; // matricNo as unique identifier
  name: string;
  matricNo: string;
  regNo: string;

  // Academic
  level: number; // 300
  department: string; // "Computer Science"

  // Internship
  companyId: string; // Normalized slug
  companyName: string; // Display name
  companyAddress: string;

  // Contact
  email: string;
  phone: string;
  parentPhone: string;

  // Metadata
  hasInternship: boolean;
}

export interface Company {
  // Identity
  id: string; // Slug (e.g., "quidax")
  name: string; // Display name
  nameVariations: string[]; // Handle duplicates

  // Location
  address: string;
  city: string;
  state: string;

  // Analytics
  internCount: number;
  studentIds: string[]; // Array of matricNos

  // Categories
  industry: string;
  tags: string[];

  // Computed
  rank?: number;
  badge?: "popular" | "validated" | "emerging";
}

export interface DashboardStats {
  totalStudents: number;
  totalCompanies: number;
  averageInternsPerCompany: number;
  topIndustry: string;
  topCity: string;
  mostPopularCompany: string;
}

export interface IndustryMetric {
  name: string;
  count: number;
  percentage: number;
  topCompanies: string[];
  color: string;
}

export interface LocationMetric {
  city: string;
  state: string;
  count: number;
  topCompanies: string[];
}

export interface RawCSVRow {
  "": string;
  "1": string;
  NAME: string;
  "MATRIC NO": string;
  "REG. NO.": string;
  LEVEL: string;
  "2": string;
  DEPARTMENT: string;
  "COMPANY'S NAME": string;
  "3": string;
  "STUDENTS' GSM NO": string;
  "PARENT GSM NO.": string;
  "STUDENT EMAIL": string;
}
