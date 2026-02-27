import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Bell, BellOff, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useGoals,
  useAddGoal,
  useUpdateGoal,
  useDeleteGoal,
  useSuggestedGoals,
} from "@/hooks/useQueries";
import { useNotificationReminder } from "@/hooks/useNotificationReminder";
import type { Goal } from "@/backend";

const SUGGESTED_ICONS = ["🌅", "🤝", "💭", "💬", "🌿"];

export default function GoalsPage() {
  const [newGoalText, setNewGoalText] = useState("");
  const { data: goals = [], isLoading: goalsLoading } = useGoals();
  const { data: suggestedGoals = [] } = useSuggestedGoals();
  const addGoalMutation = useAddGoal();
  const updateGoalMutation = useUpdateGoal();
  const deleteGoalMutation = useDeleteGoal();

  const {
    enabled: reminderEnabled,
    reminderTime,
    permissionStatus,
    setEnabled: setReminderEnabled,
    setReminderTime,
    requestPermission,
  } = useNotificationReminder();

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newGoalText.trim();
    if (!text) return;
    await addGoalMutation.mutateAsync(text);
    setNewGoalText("");
  };

  const handleAddSuggested = async (text: string) => {
    await addGoalMutation.mutateAsync(text);
  };

  const handleToggle = (goal: Goal) => {
    updateGoalMutation.mutate({ id: goal.id, completed: !goal.completed });
  };

  const handleDelete = (id: bigint) => {
    deleteGoalMutation.mutate(id);
  };

  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div
        className="relative border-b border-border/30 py-12 px-4 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, oklch(0.96 0.04 75) 0%, oklch(0.94 0.05 85) 35%, oklch(0.95 0.06 135) 100%)",
        }}
      >
        {/* Botanical leaf decorations */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg aria-hidden="true" className="absolute -left-4 bottom-0 opacity-[0.12]" width="160" height="100" viewBox="0 0 160 100">
            <path d="M0 100 Q40 60 100 40 Q130 30 160 50 Q110 55 70 75 Z" fill="oklch(0.50 0.20 145)"/>
            <path d="M0 100 Q50 70 120 55 Q145 48 160 60 Q115 65 75 85 Z" fill="oklch(0.55 0.18 135)" opacity="0.6"/>
          </svg>
          <svg aria-hidden="true" className="absolute -right-4 top-0 opacity-[0.12]" width="140" height="90" viewBox="0 0 140 90">
            <path d="M140 0 Q100 30 60 50 Q30 65 0 55 Q45 48 80 28 Z" fill="oklch(0.68 0.16 65)"/>
            <path d="M140 10 Q95 38 55 58 Q25 72 0 64 Q42 56 78 37 Z" fill="oklch(0.72 0.18 75)" opacity="0.6"/>
          </svg>
          {/* Scatter dots */}
          <div className="absolute top-6 left-1/4 w-1.5 h-1.5 rounded-full bg-primary/20"/>
          <div className="absolute top-10 right-1/3 w-1 h-1 rounded-full bg-accent-foreground/20"/>
          <div className="absolute bottom-5 left-1/3 w-2 h-2 rounded-full bg-primary/15"/>
        </div>

        <div className="max-w-2xl mx-auto text-center relative">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-primary/25"
              style={{ background: "oklch(0.98 0.025 80)" }}>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground tracking-tight" style={{ fontStyle: "italic" }}>
              Gratitude Goals
            </h1>
          </div>
          <p className="text-muted-foreground font-body text-base max-w-md mx-auto leading-relaxed">
            Set intentions to cultivate gratitude in your daily life. Small
            habits grow into a beautiful garden.
          </p>
          {totalCount > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Badge variant="secondary" className="font-body text-sm px-3 py-1 border border-primary/20 bg-background/60">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {completedCount} of {totalCount} completed
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Add Goal Form */}
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">
            Add a New Goal
          </h2>
          <form onSubmit={handleAddGoal} className="flex gap-2">
            <Input
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="e.g. Write 3 things I'm grateful for each morning…"
              className="flex-1 font-body bg-card border-border/60 focus:border-primary/60"
              disabled={addGoalMutation.isPending}
            />
            <Button
              type="submit"
              disabled={!newGoalText.trim() || addGoalMutation.isPending}
              className="shrink-0"
            >
              {addGoalMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span className="ml-1.5">Add</span>
            </Button>
          </form>
        </section>

        {/* Goals List */}
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">
            My Goals
          </h2>

          {goalsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : goals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/50 p-8 text-center">
              <div className="text-4xl mb-3">🌱</div>
              <p className="font-display text-base font-medium text-foreground mb-1">
                No goals yet
              </p>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Start with one of these suggestions to cultivate daily gratitude:
              </p>
              <div className="space-y-2">
                {suggestedGoals.map((suggestion, sugIdx) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleAddSuggested(suggestion)}
                    disabled={addGoalMutation.isPending}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl bg-background hover:bg-primary/5 border border-border/40 hover:border-primary/30 transition-all group"
                  >
                    <span className="text-xl">{SUGGESTED_ICONS[sugIdx % SUGGESTED_ICONS.length] ?? "✨"}</span>
                    <span className="font-body text-sm text-foreground group-hover:text-primary transition-colors flex-1">
                      {suggestion}
                    </span>
                    <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => (
                <GoalCard
                  key={String(goal.id)}
                  goal={goal}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  isUpdating={
                    updateGoalMutation.isPending &&
                    updateGoalMutation.variables?.id === goal.id
                  }
                  isDeleting={
                    deleteGoalMutation.isPending &&
                    deleteGoalMutation.variables === goal.id
                  }
                />
              ))}

              {/* Suggested goals when list has items */}
              {suggestedGoals.length > 0 && (
                <div className="pt-2">
                  <p className="font-body text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                    Suggestions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedGoals
                      .filter((s) => !goals.some((g) => g.text === s))
                      .slice(0, 3)
                      .map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleAddSuggested(suggestion)}
                          disabled={addGoalMutation.isPending}
                          className="text-xs font-body px-3 py-1.5 rounded-full bg-primary/8 hover:bg-primary/15 text-primary border border-primary/20 transition-all"
                        >
                          + {suggestion}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Reminder Settings */}
        <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-warm">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Daily Reminders
            </h2>
          </div>
          <p className="font-body text-sm text-muted-foreground mb-5">
            Get a gentle nudge to add to your gratitude garden each day.
          </p>

          {permissionStatus === "unsupported" ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/8 border border-destructive/20">
              <BellOff className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="font-body text-sm text-destructive">
                Notifications are not supported in your browser. Try using a
                modern browser like Chrome or Firefox.
              </p>
            </div>
          ) : permissionStatus === "denied" ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/8 border border-destructive/20">
              <BellOff className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="font-body text-sm text-destructive">
                Notification permission was denied. Please enable notifications
                in your browser settings to use this feature.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="reminder-toggle"
                  className="font-body text-sm text-foreground cursor-pointer"
                >
                  Enable daily reminders
                </Label>
                <Switch
                  id="reminder-toggle"
                  checked={reminderEnabled}
                  onCheckedChange={(checked) => setReminderEnabled(checked)}
                />
              </div>

              {reminderEnabled && (
                <div className="flex items-center gap-3 pt-1">
                  <Label
                    htmlFor="reminder-time"
                    className="font-body text-sm text-muted-foreground whitespace-nowrap"
                  >
                    Remind me at
                  </Label>
                  <input
                    id="reminder-time"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="font-body text-sm bg-background border border-border/60 rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              )}

              {reminderEnabled && permissionStatus === "default" && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
                  <Bell className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-body text-sm text-amber-700 dark:text-amber-400 mb-2">
                      Permission required to send notifications.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={requestPermission}
                      className="text-xs"
                    >
                      Allow Notifications
                    </Button>
                  </div>
                </div>
              )}

              {reminderEnabled && permissionStatus === "granted" && (
                <div className="flex items-center gap-2 text-sm font-body text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Reminder set for {reminderTime} daily
                  </span>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

interface GoalCardProps {
  goal: Goal;
  onToggle: (goal: Goal) => void;
  onDelete: (id: bigint) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

function GoalCard({ goal, onToggle, onDelete, isUpdating, isDeleting }: GoalCardProps) {
  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all ${
        goal.completed
          ? "bg-muted/40 border-border/30 opacity-70"
          : "bg-card border-border/50 shadow-warm hover:border-primary/30"
      } ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
    >
      <button
        type="button"
        onClick={() => onToggle(goal)}
        disabled={isUpdating}
        className="mt-0.5 shrink-0 text-primary hover:text-primary/80 transition-colors"
        aria-label={goal.completed ? "Mark incomplete" : "Mark complete"}
      >
        {isUpdating ? (
          <span className="w-5 h-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin block" />
        ) : goal.completed ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <span
        className={`flex-1 font-body text-sm leading-relaxed ${
          goal.completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {goal.text}
      </span>

      <button
        type="button"
        onClick={() => onDelete(goal.id)}
        disabled={isDeleting}
        className="shrink-0 mt-0.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Delete goal"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
