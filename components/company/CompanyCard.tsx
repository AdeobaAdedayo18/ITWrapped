"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Company } from "@/lib/types/internship";
import { CompanyLogo } from "./CompanyLogo";
import { Users, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface CompanyCardProps {
  company: Company;
  onClick: () => void;
  delay?: number;
}

export function CompanyCard({ company, onClick, delay = 0 }: CompanyCardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="p-6 border-2 hover:border-primary cursor-pointer transition-all hover:shadow-lg group h-full"
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <CompanyLogo
            company={company}
            size={48}
            className="group-hover:scale-110 transition-transform"
          />
          <Badge className={getBadgeColor()}>
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
    </motion.div>
  );
}

interface CompanyGridProps {
  companies: Company[];
  onCompanyClick: (companyId: string) => void;
}

export function CompanyGrid({ companies, onCompanyClick }: CompanyGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company, index) => (
        <CompanyCard
          key={company.id}
          company={company}
          onClick={() => onCompanyClick(company.id)}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}
