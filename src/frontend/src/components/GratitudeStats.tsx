import { Sparkles } from 'lucide-react';
import { useGetEntries } from '@/hooks/useQueries';

const MOTIVATIONAL_MESSAGES = [
    "Every moment of gratitude brightens your day.",
    "Gratitude turns what we have into enough.",
    "A grateful heart is a magnet for miracles.",
    "Small joys, noticed daily, build a beautiful life.",
    "Counting blessings multiplies them.",
];

function getMotivationalMessage(count: number): string {
    if (count === 0) return "Start your gratitude journey today — every entry counts!";
    if (count === 1) return "You've taken the first step. Keep going!";
    if (count < 5) return "You're building a beautiful habit. Keep it up!";
    if (count < 10) return MOTIVATIONAL_MESSAGES[count % MOTIVATIONAL_MESSAGES.length];
    if (count < 25) return "You're on a roll! Gratitude is transforming your perspective.";
    if (count < 50) return "Incredible! Your gratitude practice is truly blossoming.";
    return "You're a gratitude champion! Your positivity is inspiring.";
}

export function GratitudeStats() {
    const { data: entries = [] } = useGetEntries();
    const count = entries.length;
    const message = getMotivationalMessage(count);

    return (
        <div className="relative overflow-hidden rounded-2xl bg-primary/10 border border-primary/20 px-6 py-5 flex items-center gap-4 shadow-warm">
            {/* Decorative background glow */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

            <div className="shrink-0">
                <img
                    src="/assets/generated/sun-icon.dim_64x64.png"
                    alt="Sun"
                    className="w-12 h-12 drop-shadow-sm"
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-lg font-semibold text-foreground">
                        {count === 0
                            ? "No entries yet"
                            : `You've found `}
                        {count > 0 && (
                            <span className="text-primary font-bold">{count}</span>
                        )}
                        {count > 0 && ` thing${count !== 1 ? 's' : ''} to be grateful for!`}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                    {message}
                </p>
            </div>
        </div>
    );
}
