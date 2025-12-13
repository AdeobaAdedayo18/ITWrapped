"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface Company {
  name: string;
  internCount: number;
  currentLogo: string | null;
}

export default function AdminLogosPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [domainUrl, setDomainUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

  // Fetch companies without logos
  useEffect(() => {
    if (isAuthenticated) {
      fetchCompanies();
    }
  }, [isAuthenticated]);

  // Filter companies based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = companies.filter((company) =>
        company.name.toLowerCase().includes(query)
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies([]);
    }
  }, [searchQuery, companies]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/companies-without-logos");
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "nextunicornfounder") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleFetchLogo = async () => {
    if (!domainUrl.trim()) return;

    setIsFetching(true);
    setFetchError("");
    setPreviewUrl("");

    try {
      const response = await fetch("/api/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: domainUrl }),
      });

      const data = await response.json();
      if (data.logoUrl) {
        setPreviewUrl(data.logoUrl);
        setFetchError("");
      } else {
        setFetchError("Could not fetch logo from this domain");
      }
    } catch {
      setFetchError("Failed to fetch logo. Please check the URL.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSaveLogo = async () => {
    const currentCompany = companies[currentIndex];
    const logoToSave = imageUrl || previewUrl;

    if (!logoToSave) {
      setFetchError("No logo to save. Please fetch or enter an image URL.");
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch("/api/admin/save-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: currentCompany.name,
          logoUrl: logoToSave,
          source: imageUrl ? "manual" : "fetched",
        }),
      });

      if (response.ok) {
        setSuccess(`✅ Logo saved for ${currentCompany.name}!`);
        setCompletedCount((prev) => prev + 1);
        setTimeout(() => {
          handleNext();
          setSuccess("");
        }, 1500);
      } else {
        setFetchError("Failed to save logo");
      }
    } catch {
      setFetchError("Error saving logo");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSkip = () => {
    setFetchError("");
    setSuccess("");
    handleNext();
  };

  const handleNext = () => {
    setDomainUrl("");
    setImageUrl("");
    setPreviewUrl("");
    setFetchError("");
    setSearchQuery("");
    setShowSearch(false);
    if (currentIndex < companies.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSelectCompany = (companyName: string) => {
    const index = companies.findIndex((c) => c.name === companyName);
    if (index !== -1) {
      setCurrentIndex(index);
      setSearchQuery("");
      setShowSearch(false);
      setDomainUrl("");
      setImageUrl("");
      setPreviewUrl("");
      setFetchError("");
      setSuccess("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white border-2 border-black rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-2">🔒 Admin Access</h1>
            <p className="text-muted-foreground mb-6">Logo Management System</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="mt-2"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Unlock
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (companies.length === 0 || currentIndex >= companies.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-2">All Done!</h1>
          <p className="text-lg text-muted-foreground mb-6">
            You&apos;ve completed {completedCount} companies
          </p>
          <Button onClick={() => (window.location.href = "/")}>
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentCompany = companies[currentIndex];
  const progress = ((completedCount + currentIndex) / companies.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b-2 border-black bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold">Logo Manager</h1>
              <p className="text-sm text-muted-foreground">
                {completedCount} completed • {currentIndex + 1} of{" "}
                {companies.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium mb-1">Progress</div>
              <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <Button
              onClick={() => setShowSearch(!showSearch)}
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              🔍 Search for a specific company…
            </Button>

            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black rounded-xl shadow-xl z-50"
                >
                  <div className="p-3">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type company name..."
                      className="mb-2"
                      autoFocus
                    />
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {filteredCompanies.length > 0 ? (
                        filteredCompanies.map((company, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectCompany(company.name)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium">{company.name}</span>
                            <span className="text-xs text-muted-foreground">
                              👥 {company.internCount}
                            </span>
                          </button>
                        ))
                      ) : searchQuery ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No companies found
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Start typing to search...
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border-2 border-black rounded-2xl p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {currentCompany.name}
                </h2>
                <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-3 py-1">
                  <span className="text-sm font-semibold">
                    👥 {currentCompany.internCount} intern
                    {currentCompany.internCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-xl"
              >
                <p className="font-semibold text-green-800">{success}</p>
              </motion.div>
            )}

            {fetchError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-xl"
              >
                <p className="font-semibold text-red-800">{fetchError}</p>
              </motion.div>
            )}

            <div className="space-y-6">
              <div>
                <Label htmlFor="domainUrl">Company Website URL</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="domainUrl"
                    type="url"
                    value={domainUrl}
                    onChange={(e) => setDomainUrl(e.target.value)}
                    placeholder="https://company.com"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && domainUrl) {
                        handleFetchLogo();
                      }
                    }}
                  />
                  <Button
                    onClick={handleFetchLogo}
                    disabled={!domainUrl || isFetching}
                  >
                    {isFetching ? "Fetching..." : "Fetch Logo"}
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-muted"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground font-semibold">
                    Or
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="imageUrl">
                  Direct Image URL (for special cases)
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="mt-2"
                />
              </div>

              {(previewUrl || imageUrl) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-muted rounded-xl border-2 border-border"
                >
                  <p className="text-sm font-semibold mb-3">Logo Preview:</p>
                  <div className="relative w-32 h-32 mx-auto bg-white rounded-xl border-2 border-black flex items-center justify-center overflow-hidden">
                    <Image
                      src={imageUrl || previewUrl}
                      alt={currentCompany.name}
                      fill
                      className="object-contain p-2"
                      onError={() => {
                        setFetchError("Failed to load image preview");
                        setPreviewUrl("");
                        setImageUrl("");
                      }}
                    />
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveLogo}
                  disabled={(!previewUrl && !imageUrl) || isFetching}
                  className="flex-1"
                >
                  {isFetching ? "Saving..." : "Save Logo"}
                </Button>
                <Button onClick={handleSkip} variant="outline" className="px-8">
                  Skip
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
