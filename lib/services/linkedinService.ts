/**
 * LinkedIn Service
 * Generate smart LinkedIn search links
 */

import { Student } from "../types/internship";

/**
 * Generate LinkedIn search URL for a student
 * Opens LinkedIn search with student name and company
 */
export function generateLinkedInSearchUrl(student: Student): string {
  // Clean and encode name and company
  const fullName = student.name.trim();
  const nameParts = fullName.split(/\s+/);
  // Use only first two names for more accurate search
  const name = nameParts.slice(0, 2).join(" ");
  const company = student.companyName.trim();

  // Build search query
  const query = `${name} Covenant University`;

  // Encode for URL
  const encodedQuery = encodeURIComponent(query);

  // LinkedIn people search URL
  return `https://www.linkedin.com/search/results/people/?keywords=${encodedQuery}`;
}

/**
 * Generate LinkedIn search URL with just name (if no company)
 */
export function generateLinkedInSearchByName(name: string): string {
  const encodedName = encodeURIComponent(name.trim());
  return `https://www.linkedin.com/search/results/people/?keywords=${encodedName}`;
}

/**
 * Generate LinkedIn search URL with filters
 * Can include school, company, location
 */
export function generateAdvancedLinkedInSearch(params: {
  name: string;
  company?: string;
  school?: string;
  location?: string;
}): string {
  // Use only first two names for more accurate search
  const nameParts = params.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, 2).join(" ");
  
  const parts: string[] = [firstName];

  if (params.company) parts.push(params.company);
  if (params.school) parts.push(params.school);
  if (params.location) parts.push(params.location);

  const query = parts.join(" ");
  const encodedQuery = encodeURIComponent(query);

  return `https://www.linkedin.com/search/results/people/?keywords=${encodedQuery}`;
}

/**
 * Open LinkedIn search in new tab
 */
export function openLinkedInSearch(url: string): void {
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
