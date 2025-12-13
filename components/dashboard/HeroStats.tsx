"use client";

import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types/internship";
import { Building2, Users, TrendingUp, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface HeroStatsProps {
  stats: DashboardStats;
}

export function HeroStats({ stats }: HeroStatsProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">
          Discover Where{" "}
          <span className="inline-flex items-center gap-2 text-primary">
            <AnimatedNumber value={stats.totalStudents} />
            <span>Students</span>
          </span>
          <br />
          Interned in 2024
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {stats.totalCompanies}+ companies • {stats.topIndustry} dominates •
          Connect with peers instantly
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          value={stats.totalStudents}
          label="Total Interns"
          color="primary"
        />
        <StatCard
          icon={<Building2 className="w-6 h-6" />}
          value={stats.totalCompanies}
          label="Companies"
          suffix="+"
          color="gold"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          value={Math.round(stats.averageInternsPerCompany * 10) / 10}
          label="Avg per Company"
          color="neon"
        />
        <StatCard
          icon={<MapPin className="w-6 h-6" />}
          textValue={stats.topCity}
          label="Top Location"
          color="accent"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value?: number;
  textValue?: string;
  label: string;
  suffix?: string;
  color: "primary" | "gold" | "neon" | "accent";
}

function StatCard({
  icon,
  value,
  textValue,
  label,
  suffix = "",
  color,
}: StatCardProps) {
  const colorClasses = {
    primary: "border-primary/20 hover:border-primary/40 hover:bg-primary/5",
    gold: "border-brand-gold/20 hover:border-brand-gold/40 hover:bg-brand-gold/5",
    neon: "border-brand-neon/20 hover:border-brand-neon/40 hover:bg-brand-neon/5",
    accent: "border-accent/20 hover:border-accent/40 hover:bg-accent/5",
  };

  const iconColors = {
    primary: "text-primary",
    gold: "text-brand-gold",
    neon: "text-brand-neon",
    accent: "text-accent",
  };

  return (
    <Card
      className={`p-6 border-2 transition-all hover:shadow-lg ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-full bg-card border-2 border-current ${iconColors[color]}`}
        >
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-black tracking-tight">
          {value !== undefined ? (
            <>
              <AnimatedNumber value={value} />
              {suffix}
            </>
          ) : (
            textValue
          )}
        </p>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
      </div>
    </Card>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
}
