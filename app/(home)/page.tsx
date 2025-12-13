"use client";

import { useState, useMemo } from "react";
import { useInternshipData } from "@/lib/hooks/useInternshipData";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { PopularityChart } from "@/components/dashboard/PopularityChart";
import { QuickSearch } from "@/components/dashboard/QuickSearch";
import { CompanyGrid } from "@/components/company/CompanyCard";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Landmark,
  Cpu,
  Radio,
  Zap,
  MapPin,
  GraduationCap,
  Package,
} from "lucide-react";

// Industry categories for filtering
const INDUSTRY_FILTERS = [
  { label: "All", value: "all", icon: Building2 },
  { label: "Banking & Fintech", value: "Banking & Fintech", icon: Landmark },
  { label: "IT & Consulting", value: "IT & Consulting", icon: Cpu },
  { label: "Telecommunications", value: "Telecommunications", icon: Radio },
  { label: "Energy & Oil/Gas", value: "Energy & Oil/Gas", icon: Zap },
  { label: "Government", value: "Government", icon: MapPin },
  { label: "Education", value: "Education", icon: GraduationCap },
  { label: "Manufacturing", value: "Manufacturing", icon: Package },
  { label: "Other", value: "Other", icon: Building2 },
];

export default function Index() {
  const {
    students,
    companies,
    stats,
    loading,
    error,
    getStudentsByCompany,
    search,
  } = useInternshipData();

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  // Get selected company data
  const selectedCompany = useMemo(() => {
    if (!selectedCompanyId) return null;
    return companies.find((c) => c.id === selectedCompanyId);
  }, [selectedCompanyId, companies]);

  // Get students for selected company
  const companyStudents = useMemo(() => {
    if (!selectedCompanyId) return [];
    return getStudentsByCompany(selectedCompanyId);
  }, [selectedCompanyId, getStudentsByCompany]);

  // Filter companies by search and industry
  const filteredCompanies = useMemo(() => {
    let result = companies;

    // Filter by industry
    if (selectedIndustry !== "all") {
      result = result.filter((c) => c.industry === selectedIndustry);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.industry.toLowerCase().includes(query) ||
          c.city.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery, selectedIndustry, companies]);

  // Check if user is actively searching or filtering
  const isSearching =
    searchQuery.trim().length > 0 || selectedIndustry !== "all";

  // Handle company click
  const handleCompanyClick = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  // Handle back from company profile
  const handleBack = () => {
    setSelectedCompanyId(null);
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-lg font-medium">Loading internship data...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-xl font-bold text-destructive mb-2">
            Error Loading Data
          </p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </main>
    );
  }

  // Show company profile if selected
  if (selectedCompany) {
    return (
      <CompanyProfile
        company={selectedCompany}
        students={companyStudents}
        onBack={handleBack}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Stats */}
      <HeroStats stats={stats} />

      {/* Search & Filters Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <QuickSearch onSearch={setSearchQuery} />

        {/* Industry Filter Buttons */}
        <div className="mt-6">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Filter by Industry
          </p>
          <div className="flex flex-wrap gap-2">
            {INDUSTRY_FILTERS.map((filter) => {
              const Icon = filter.icon;
              const isActive = selectedIndustry === filter.value;
              return (
                <Button
                  key={filter.value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedIndustry(filter.value)}
                  className={`gap-2 transition-all ${
                    isActive ? "shadow-md" : "hover:border-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Results - Shows above Popular Companies when searching */}
      {isSearching && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-3xl font-black tracking-tight mb-2">
              🔍 {searchQuery ? "Search Results" : "Filtered Companies"}{" "}
              <span className="text-primary">({filteredCompanies.length})</span>
            </h2>
            <p className="text-muted-foreground">
              {searchQuery
                ? `Showing results for "${searchQuery}"`
                : `Filtered by ${selectedIndustry}`}
            </p>
          </div>

          {filteredCompanies.length > 0 ? (
            <CompanyGrid
              companies={filteredCompanies}
              onCompanyClick={handleCompanyClick}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No companies found matching your criteria
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedIndustry("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Popularity Chart - Only show when not searching */}
      {!isSearching && (
        <PopularityChart
          companies={companies}
          onCompanyClick={handleCompanyClick}
          maxDisplay={10}
        />
      )}

      {/* All Companies Grid - Only show when not searching */}
      {!isSearching && (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-3xl font-black tracking-tight mb-2">
              🏢 All Companies
            </h2>
            <p className="text-muted-foreground">
              Browse all internship opportunities
            </p>
          </div>

          <CompanyGrid
            companies={companies}
            onCompanyClick={handleCompanyClick}
          />
        </div>
      )}
    </main>
  );
}
