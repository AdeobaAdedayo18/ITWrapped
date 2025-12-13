"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Student } from "@/lib/types/internship";
import {
  generateLinkedInSearchUrl,
  openLinkedInSearch,
} from "@/lib/services/linkedinService";
import {
  Mail,
  Phone,
  Copy,
  User,
  GraduationCap,
  Building2,
  Check,
  Linkedin,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
  delay?: number;
}

export function StudentCard({ student, delay = 0 }: StudentCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className="p-6 border-2 hover:border-primary transition-all hover:shadow-lg">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-full bg-primary/10 border-2 border-primary/20">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-2">
              {student.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                {student.level}L
              </span>
              <span>•</span>
              <span>{student.department}</span>
            </div>
          </div>
        </div>

        {/* Company */}
        {student.hasInternship && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-muted/50">
            <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium line-clamp-1">
              {student.companyName}
            </span>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2">
          {/* Email */}
          {student.email && (
            <ContactRow
              icon={<Mail className="w-4 h-4" />}
              value={student.email}
              label="Email"
              onCopy={() => copyToClipboard(student.email, "email")}
              isCopied={copiedField === "email"}
            />
          )}

          {/* Phone */}
          {student.phone && (
            <ContactRow
              icon={<Phone className="w-4 h-4" />}
              value={student.phone}
              label="Phone"
              onCopy={() => copyToClipboard(student.phone, "phone")}
              isCopied={copiedField === "phone"}
            />
          )}
        </div>

        {/* LinkedIn Search */}
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full gap-2 hover:bg-primary/10 hover:border-primary transition-all"
            onClick={(e) => {
              e.stopPropagation();
              const url = generateLinkedInSearchUrl(student);
              openLinkedInSearch(url);
            }}
          >
            <Linkedin className="w-4 h-4" />
            Find on LinkedIn
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

interface ContactRowProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  onCopy: () => void;
  isCopied: boolean;
}

function ContactRow({ icon, value, label, onCopy, isCopied }: ContactRowProps) {
  return (
    <div className="flex items-center gap-2 group">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-mono truncate">{value}</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onCopy();
        }}
      >
        {isCopied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
