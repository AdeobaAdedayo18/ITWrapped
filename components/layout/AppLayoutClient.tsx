"use client";

import { useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/NavBar";
import { FeedbackModalRef } from "@/components/FeedbackModal";
import { useFeedbackAutoShow } from "@/lib/hooks/useFeedbackAutoShow";

/**
 * Client wrapper for the app layout that handles feedback modal auto-show logic
 * - Manages the 2-minute timer for auto-showing the feedback modal
 * - Integrates with localStorage to prevent duplicate auto-shows
 * - Maintains navbar ref for programmatic modal control
 */
export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const navbarRef = useRef<FeedbackModalRef>(null);
  const { shouldAutoShow, markAsShown } = useFeedbackAutoShow();

  useEffect(() => {
    if (shouldAutoShow && navbarRef.current) {
      // Auto-show the modal after 2 minutes
      navbarRef.current.openModal();

      // Mark as shown in localStorage
      markAsShown();
    }
  }, [shouldAutoShow, markAsShown]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar ref={navbarRef} />
      {children}
    </div>
  );
}
