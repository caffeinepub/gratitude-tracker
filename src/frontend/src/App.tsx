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
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => setPage("home")}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <Leaf className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif text-lg font-bold text-foreground">
              Gratitude Garden
            </span>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage("home")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-sans transition-all ${
                page === "home"
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <TreePine className="w-4 h-4" />
              <span className="hidden sm:inline">Garden</span>
            </button>
            <button
              type="button"
              onClick={() => setPage("goals")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-sans transition-all ${
                page === "goals"
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                  Your Gratitude Garden
                </h1>
                <p className="font-sans text-sm text-white/85 mt-1 drop-shadow">
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
