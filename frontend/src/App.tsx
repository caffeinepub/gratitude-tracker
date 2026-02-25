import { useState } from 'react';
import { GratitudeStats } from '@/components/GratitudeStats';
import { GratitudeForm } from '@/components/GratitudeForm';
import { GratitudeList } from '@/components/GratitudeList';
import { PlantGarden } from '@/components/PlantGarden';
import { Heart, Leaf, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ViewMode = 'garden' | 'list';

function Header() {
    return (
        <header className="w-full bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-20">
            <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
                <img
                    src="/assets/generated/sun-icon.dim_64x64.png"
                    alt="Grateful Daily"
                    className="w-8 h-8"
                />
                <div>
                    <h1 className="font-serif text-xl font-bold text-foreground leading-tight">
                        Grateful Daily
                    </h1>
                    <p className="text-xs text-muted-foreground leading-none">
                        Your personal gratitude garden
                    </p>
                </div>
            </div>
        </header>
    );
}

function HeroBanner() {
    return (
        <div className="w-full rounded-2xl overflow-hidden shadow-warm mb-6">
            <img
                src="/assets/generated/gratitude-hero.dim_1200x400.png"
                alt="Gratitude journal hero"
                className="w-full h-40 sm:h-52 object-cover object-center"
            />
        </div>
    );
}

function Footer() {
    const year = new Date().getFullYear();
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'grateful-daily';
    const utmContent = encodeURIComponent(hostname);

    return (
        <footer className="w-full border-t border-border mt-16 py-8">
            <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
                <span>© {year} Grateful Daily</span>
                <span className="flex items-center gap-1.5">
                    Built with{' '}
                    <Heart className="w-3.5 h-3.5 text-primary fill-primary" />{' '}
                    using{' '}
                    <a
                        href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${utmContent}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                    >
                        caffeine.ai
                    </a>
                </span>
            </div>
        </footer>
    );
}

export default function App() {
    const [viewMode, setViewMode] = useState<ViewMode>('garden');

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
                <HeroBanner />

                {/* Stats */}
                <section className="mb-6">
                    <GratitudeStats />
                </section>

                {/* Entry form */}
                <section className="mb-8">
                    <GratitudeForm />
                </section>

                {/* View toggle + content */}
                <section>
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <h2 className="font-serif text-lg font-semibold text-foreground">
                            {viewMode === 'garden' ? 'Your Gratitude Garden' : 'Your Gratitude Entries'}
                        </h2>
                        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('garden')}
                                className={`rounded-lg gap-1.5 text-xs font-medium transition-all ${
                                    viewMode === 'garden'
                                        ? 'bg-card shadow-xs text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Leaf className="w-3.5 h-3.5" />
                                Garden
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className={`rounded-lg gap-1.5 text-xs font-medium transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-card shadow-xs text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <List className="w-3.5 h-3.5" />
                                List
                            </Button>
                        </div>
                    </div>

                    {viewMode === 'garden' ? <PlantGarden /> : <GratitudeList />}
                </section>
            </main>

            <Footer />
        </div>
    );
}
