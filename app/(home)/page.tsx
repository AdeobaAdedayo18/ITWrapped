"use client";

import { useState, useMemo, useEffect } from "react";
import { useInternshipData } from "@/lib/hooks/useInternshipData";
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";
import { useScrollMemory } from "@/lib/hooks/useScrollMemory";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { PopularityChart } from "@/components/dashboard/PopularityChart";
import { QuickSearch } from "@/components/dashboard/QuickSearch";
import { CompanyGrid } from "@/components/company/CompanyCard";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
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

// Pagination constants
const INITIAL_DISPLAY = 20;
const LOAD_MORE_COUNT = 5;

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
    companies,
    stats,
    loading,
    error,
    getStudentsByCompany,
  } = useInternshipData();

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Scroll memory hooks
  const { loadScrollState, clearScrollState } = useScrollMemory(displayCount);

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

  // Paginated companies for display
  const displayedCompanies = useMemo(() => {
    // If fewer than 20 total, show all without pagination
    if (filteredCompanies.length <= INITIAL_DISPLAY) {
      return filteredCompanies;
    }
    return filteredCompanies.slice(0, displayCount);
  }, [filteredCompanies, displayCount]);

  const hasMore = displayedCompanies.length < filteredCompanies.length;

  // Load more handler
  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    // Simulate network delay for smooth UX
    setTimeout(() => {
      setDisplayCount((prev) => prev + LOAD_MORE_COUNT);
      setIsLoadingMore(false);
    }, 100);
  };

  // Infinite scroll hook
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    threshold: 200,
    onLoadMore: handleLoadMore,
  });

  // Restore scroll position on mount
  useEffect(() => {
    if (companies.length > 0 && !selectedCompanyId) {
      const savedState = loadScrollState();
      if (savedState && savedState.displayedCount > INITIAL_DISPLAY) {
        setDisplayCount(savedState.displayedCount);
        // Restore scroll position after content loads
        requestAnimationFrame(() => {
          window.scrollTo(0, savedState.scrollPosition);
        });
      }
    }
  }, [companies.length, selectedCompanyId, loadScrollState]);

  // Reset display count when search/filter changes
  useEffect(() => {
    setDisplayCount(INITIAL_DISPLAY);
    clearScrollState();
  }, [searchQuery, selectedIndustry, clearScrollState]);

  // Handle company click
  const handleCompanyClick = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  // Handle back from company profile
  const handleBack = () => {
    setSelectedCompanyId(null);
    // Scroll position will be restored by useEffect
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
              <span className="text-primary">
                ({displayedCompanies.length}
                {hasMore && `/${filteredCompanies.length}`})
              </span>
            </h2>
            <p className="text-muted-foreground">
              {searchQuery
                ? `Showing results for "${searchQuery}"`
                : `Filtered by ${selectedIndustry}`}
            </p>
          </div>

          {displayedCompanies.length > 0 ? (
            <>
              <CompanyGrid
                companies={displayedCompanies}
                onCompanyClick={handleCompanyClick}
                disableAnimation={displayCount > INITIAL_DISPLAY}
              />

              {/* Infinite scroll sentinel */}
              {hasMore && (
                <div
                  ref={sentinelRef}
                  className="h-20 flex items-center justify-center mt-8"
                >
                  <p className="text-sm text-muted-foreground">
                    Scroll for more...
                  </p>
                </div>
              )}
            </>
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
              🏢 All Companies{" "}
              <span className="text-primary">
                ({displayedCompanies.length}
                {hasMore && `/${companies.length}`})
              </span>
            </h2>
            <p className="text-muted-foreground">
              Browse all internship opportunities
            </p>
          </div>

          <CompanyGrid
            companies={displayedCompanies}
            onCompanyClick={handleCompanyClick}
            disableAnimation={displayCount > INITIAL_DISPLAY}
          />

          {/* Infinite scroll sentinel */}
          {hasMore && (
            <div
              ref={sentinelRef}
              className="h-20 flex items-center justify-center mt-8"
            >
              {isLoadingMore ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Loading more...
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground animate-pulse">
                  Scroll for more...
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </main>
  );
}
