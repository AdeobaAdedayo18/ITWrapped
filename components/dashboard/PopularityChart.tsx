"use client";

import { Card } from "@/components/ui/card";
import type { Company } from "@/lib/types/internship";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface PopularityChartProps {
  companies: Company[];
  onCompanyClick: (companyId: string) => void;
  maxDisplay?: number;
}

export function PopularityChart({
  companies,
  onCompanyClick,
  maxDisplay = 10,
}: PopularityChartProps) {
  const topCompanies = companies.slice(0, maxDisplay);
  const maxInterns = topCompanies[0]?.internCount || 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-3xl font-black tracking-tight mb-2">
          🔥 Most Popular Companies
        </h2>
        <p className="text-muted-foreground">
          Click any company to see who interned there
        </p>
      </div>

      <div className="space-y-3">
        {topCompanies.map((company, index) => (
          <CompanyBar
            key={company.id}
            company={company}
            rank={index + 1}
            maxInterns={maxInterns}
            onClick={() => onCompanyClick(company.id)}
            delay={index * 0.05}
          />
        ))}
      </div>

      {companies.length > maxDisplay && (
        <div className="mt-6 text-center">
          <button className="text-primary hover:underline font-medium inline-flex items-center gap-2">
            View All {companies.length} Companies
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

interface CompanyBarProps {
  company: Company;
  rank: number;
  maxInterns: number;
  onClick: () => void;
  delay: number;
}

function CompanyBar({
  company,
  rank,
  maxInterns,
  onClick,
  delay,
}: CompanyBarProps) {
  const percentage = (company.internCount / maxInterns) * 100;

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "popular":
        return "default"; // primary color
      case "validated":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card
        className="p-4 border-2 hover:border-primary cursor-pointer transition-all hover:shadow-lg group"
        onClick={onClick}
      >
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className="text-2xl font-black w-12 text-center flex-shrink-0">
            {getRankEmoji(rank)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Company Name and Badges */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{company.city}</span>
                  <span>•</span>
                  <span>{company.industry}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={getBadgeVariant(company.badge || "emerging")}>
                  {company.badge === "popular" && "🔥 "}
                  {company.badge === "validated" && "✓ "}
                  {company.badge}
                </Badge>
                <div className="flex items-center gap-1 font-bold">
                  <Users className="w-4 h-4" />
                  <span>{company.internCount}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{
                  delay: delay + 0.2,
                  duration: 0.6,
                  ease: "easeOut",
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
