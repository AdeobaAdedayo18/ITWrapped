/**
 * useInternshipData Hook
 * Loads and manages internship data from CSV
 */

import { useEffect, useState, useMemo } from "react";
import type { Student, Company, DashboardStats } from "../types/internship";
import { parseCSVText } from "../data/csvParser";
import {
  aggregateCompanies,
  calculateDashboardStats,
  calculateIndustryMetrics,
  calculateLocationMetrics,
  searchStudents,
  filterCompanies,
} from "../data/dataProcessor";

export function useInternshipData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load CSV data on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Fetch the CSV file from public folder
        const response = await fetch("/data/internships.csv");
        if (!response.ok) {
          throw new Error("Failed to load CSV data");
        }
        const csvText = await response.text();
        const parsedStudents = parseCSVText(csvText);
        setStudents(parsedStudents);
        setError(null);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Aggregate companies from students
  const companies = useMemo(() => {
    return aggregateCompanies(students);
  }, [students]);

  // Calculate dashboard stats
  const stats = useMemo(() => {
    return calculateDashboardStats(students, companies);
  }, [students, companies]);

  // Industry metrics
  const industryMetrics = useMemo(() => {
    return calculateIndustryMetrics(companies);
  }, [companies]);

  // Location metrics
  const locationMetrics = useMemo(() => {
    return calculateLocationMetrics(companies);
  }, [companies]);

  // Get students by company
  const getStudentsByCompany = (companyId: string): Student[] => {
    return students.filter((s) => s.companyId === companyId);
  };

  // Get company by ID
  const getCompanyById = (companyId: string): Company | undefined => {
    return companies.find((c) => c.id === companyId);
  };

  // Search functionality
  const search = (query: string): Student[] => {
    return searchStudents(students, query);
  };

  // Filter companies
  const filter = (filters: {
    industry?: string;
    city?: string;
    minInterns?: number;
  }): Company[] => {
    return filterCompanies(companies, filters);
  };

  return {
    students,
    companies,
    stats,
    industryMetrics,
    locationMetrics,
    loading,
    error,
    getStudentsByCompany,
    getCompanyById,
    search,
    filter,
  };
}
