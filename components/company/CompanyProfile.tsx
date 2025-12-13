"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Company, Student } from "@/lib/types/internship";
import { CompanyLogo } from "./CompanyLogo";
import { ArrowLeft, MapPin, Users, Copy, Check } from "lucide-react";
import { StudentCard } from "@/components/student/StudentCard";
import { useState } from "react";

interface CompanyProfileProps {
  company: Company;
  students: Student[];
  onBack: () => void;
}

export function CompanyProfile({
  company,
  students,
  onBack,
}: CompanyProfileProps) {
  const [addressCopied, setAddressCopied] = useState(false);

  const copyAddress = async () => {
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(company.address);
        setAddressCopied(true);
        setTimeout(() => setAddressCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Companies
        </Button>

        {/* Company Header */}
        <Card className="p-8 border-2 mb-8">
          <div className="flex items-start gap-6">
            <CompanyLogo company={company} size={80} />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-black tracking-tight mb-2">
                    {company.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {company.city}, {company.state}
                    </span>
                    <span>•</span>
                    <span>{company.industry}</span>
                  </div>
                </div>
                <Badge className={getBadgeColor()}>
                  {company.badge === "popular" && "🔥 "}
                  {company.badge === "validated" && "✓ "}
                  {company.badge}
                </Badge>
              </div>

              {/* Address */}
              {company.address && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {company.address}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={copyAddress}>
                    {addressCopied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}

              {/* Stats */}
              <div className="mt-6 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-black">
                    {company.internCount}
                  </span>
                  <span className="text-muted-foreground">
                    {company.internCount === 1 ? "intern" : "interns"}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  #{company.rank} most popular
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Students Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-black tracking-tight mb-2">
            👥 Students Who Interned Here
          </h2>
          <p className="text-muted-foreground">
            Connect with {company.internCount}{" "}
            {company.internCount === 1 ? "student" : "students"} who interned at{" "}
            {company.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student, index) => (
            <StudentCard
              key={student.id}
              student={student}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
