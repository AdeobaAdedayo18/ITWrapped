"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Company } from "@/lib/types/internship";
import { CompanyLogo } from "./CompanyLogo";
import { Users, MapPin } from "lucide-react";

interface CompanyCardProps {
  company: Company;
  onClick: () => void;
}

export function CompanyCard({ company, onClick }: CompanyCardProps) {
  const getBadgeColor = () => {
    switch (company.badge) {
      case "popular":
        return "bg-primary text-primary-foreground";
      case "validated":
        return "bg-brand-gold text-black";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
      <Card
        className="p-6 border-2 hover:border-primary cursor-pointer transition-all hover:shadow-lg group h-full"
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <CompanyLogo
            company={company}
            size={80}
            className="group-hover:scale-110 transition-transform"
          />
          <Badge className={`${getBadgeColor()} hidden md:flex`}>
            {company.badge === "popular" && "🔥 "}
            {company.badge === "validated" && "✓ "}
            {company.badge}
          </Badge>
        </div>

        {/* Company Name */}
        <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {company.name}
        </h3>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="font-medium">
              {company.internCount}{" "}
              {company.internCount === 1 ? "intern" : "interns"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{company.city}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
            {company.industry}
          </span>
        </div>
      </Card>
    </div>
  );
}

interface CompanyGridProps {
  companies: Company[];
  onCompanyClick: (companyId: string) => void;
  disableAnimation?: boolean;
}

export function CompanyGrid({
  companies,
  onCompanyClick,
  disableAnimation = false,
}: CompanyGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onClick={() => onCompanyClick(company.id)}
        />
      ))}
    </div>
  );
}
