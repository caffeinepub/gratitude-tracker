import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Leaf, List, Target, TreePine } from "lucide-react";
import { GratitudeForm } from "./components/GratitudeForm";
import { GratitudeList } from "./components/GratitudeList";
import { GratitudeStats } from "./components/GratitudeStats";
import PlantGarden from "./components/PlantGarden";
import GoalsPage from "./components/GoalsPage";
import { useGetEntries } from "./hooks/useQueries";

const queryClient = new QueryClient();

type Page = "home" | "goals";
type ViewMode = "garden" | "list";

function AppContent() {
  const [page, setPage] = useState<Page>("home");
  const [viewMode, setViewMode] = useState<ViewMode>("garden");
  const { data: entries = [] } = useGetEntries();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-border/30 shadow-sm overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.97 0.025 85 / 0.97) 0%, oklch(0.96 0.032 75 / 0.97) 40%, oklch(0.97 0.022 135 / 0.97) 100%)",
        }}
      >
        {/* Decorative botanical leaf accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg aria-hidden="true" width="120" height="48" viewBox="0 0 120 48" className="absolute left-0 top-0 opacity-[0.07]" fill="oklch(0.52 0.18 145)">
            <path d="M0 48 Q20 20 60 8 Q80 0 100 12 Q60 18 40 36 Z" />
            <path d="M0 48 Q30 30 80 22 Q100 18 120 28 Q80 30 50 44 Z" opacity="0.6"/>
          </svg>
          <svg aria-hidden="true" width="100" height="48" viewBox="0 0 100 48" className="absolute right-0 top-0 opacity-[0.07]" fill="oklch(0.52 0.18 145)">
            <path d="M100 48 Q80 20 40 8 Q20 0 0 12 Q40 18 60 36 Z" />
          </svg>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between relative">
          {/* Logo */}
           <button
            type="button"
            onClick={() => setPage("home")}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-all shadow-sm border border-primary/20">
              <Leaf className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
              {/* Subtle ring pulse on hover */}
              <span className="absolute inset-0 rounded-full ring-2 ring-primary/0 group-hover:ring-primary/20 transition-all duration-500" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground tracking-tight" style={{ fontStyle: "italic", letterSpacing: "-0.01em" }}>
              Gratitude Garden
            </span>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage("home")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-sans transition-all ${
                page === "home"
                  ? "bg-primary/20 text-primary font-medium shadow-sm border border-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/8"
              }`}
            >
              <TreePine className="w-4 h-4" />
              <span className="hidden sm:inline">Garden</span>
            </button>
            <button
              type="button"
              onClick={() => setPage("goals")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-sans transition-all ${
                page === "goals"
                  ? "bg-primary/20 text-primary font-medium shadow-sm border border-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/8"
              }`}
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Goals</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {page === "goals" ? (
          <GoalsPage />
        ) : (
          <>
            {/* Hero Banner */}
            <div
              className="relative w-full overflow-hidden"
              style={{ maxHeight: 220 }}
            >
              <img
                src="/assets/generated/gratitude-hero.dim_1200x400.png"
                alt="Gratitude Garden"
                className="w-full object-cover"
                style={{ maxHeight: 220 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white drop-shadow-lg" style={{ fontStyle: "italic", letterSpacing: "-0.01em" }}>
                  Your Gratitude Garden
                </h1>
                <p className="font-sans text-sm text-white/85 mt-1.5 drop-shadow tracking-wide">
                  Nurture gratitude, watch it bloom 🌸
                </p>
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
              <GratitudeStats />
              <GratitudeForm />

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <span className="font-sans text-sm text-muted-foreground mr-1">
                  View:
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode("garden")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-sans transition-all ${
                    viewMode === "garden"
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Leaf className="w-4 h-4" />
                  Garden
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-sans transition-all ${
                    viewMode === "list"
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>

              {/* Garden or List */}
              {viewMode === "garden" ? (
                <PlantGarden entries={entries} />
              ) : (
                <GratitudeList />
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 py-6 px-4 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm font-sans text-muted-foreground">
          <span>© {new Date().getFullYear()} Gratitude Garden</span>
          <span className="flex items-center gap-1">
            Built with{" "}
            <span className="text-primary" aria-hidden="true">♥</span>
            <span className="sr-only">love</span>{" "}
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined"
                  ? window.location.hostname
                  : "gratitude-garden"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>

      <Toaster position="bottom-center" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
