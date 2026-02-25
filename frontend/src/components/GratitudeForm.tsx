import { useState } from 'react';
import { Loader2, PlusCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddEntry } from '@/hooks/useQueries';

const CATEGORY_SUGGESTIONS = [
    'Family', 'Health', 'Work', 'Nature', 'Friends',
    'Growth', 'Food', 'Home', 'Kindness', 'Learning',
];

export function GratitudeForm() {
    const [text, setText] = useState('');
    const [category, setCategory] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const addEntry = useAddEntry();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedText = text.trim();
        if (!trimmedText) return;

        await addEntry.mutateAsync({
            text: trimmedText,
            category: category.trim() || null,
        });

        setText('');
        setCategory('');
        setShowSuggestions(false);
    };

    const handleCategorySelect = (cat: string) => {
        setCategory(cat);
        setShowSuggestions(false);
    };

    return (
        <div className="bg-card rounded-2xl shadow-card border border-border p-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                    <PlusCircle className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">
                    What are you grateful for today?
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="gratitude-text" className="text-sm font-medium text-foreground/80">
                        Your gratitude
                    </Label>
                    <Textarea
                        id="gratitude-text"
                        placeholder="I'm grateful for… (e.g., the warm cup of coffee this morning, a kind word from a friend…)"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        className="resize-none rounded-xl border-border bg-background/60 focus:ring-primary/40 placeholder:text-muted-foreground/60 text-base leading-relaxed"
                        disabled={addEntry.isPending}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-accent-foreground" />
                        Category
                        <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="category"
                            placeholder="e.g. Family, Health, Nature…"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                            className="rounded-xl border-border bg-background/60 focus:ring-primary/40"
                            disabled={addEntry.isPending}
                        />
                        {showSuggestions && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-card z-10 overflow-hidden">
                                <div className="p-2 flex flex-wrap gap-1.5">
                                    {CATEGORY_SUGGESTIONS.filter(
                                        (s) => !category || s.toLowerCase().includes(category.toLowerCase())
                                    ).map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onMouseDown={() => handleCategorySelect(suggestion)}
                                            className="px-3 py-1 text-xs rounded-full bg-accent/30 text-accent-foreground hover:bg-accent/60 transition-colors font-medium"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={!text.trim() || addEntry.isPending}
                    className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-5 shadow-warm transition-all"
                >
                    {addEntry.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving…
                        </>
                    ) : (
                        <>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Gratitude
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
