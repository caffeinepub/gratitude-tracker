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
      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-b border-border/40 py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Target className="w-7 h-7 text-primary" />
            <h1 className="font-display text-3xl font-bold text-foreground">
              Gratitude Goals
            </h1>
          </div>
          <p className="text-muted-foreground font-body text-base max-w-md mx-auto">
            Set intentions to cultivate gratitude in your daily life. Small
            habits grow into a beautiful garden.
          </p>
          {totalCount > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Badge variant="secondary" className="font-body text-sm px-3 py-1">
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
                {suggestedGoals.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddSuggested(suggestion)}
                    disabled={addGoalMutation.isPending}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl bg-background hover:bg-primary/5 border border-border/40 hover:border-primary/30 transition-all group"
                  >
                    <span className="text-xl">{SUGGESTED_ICONS[i] ?? "✨"}</span>
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
                      .map((suggestion, i) => (
                        <button
                          key={i}
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
      className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all ${
        goal.completed
          ? "bg-muted/40 border-border/30 opacity-70"
          : "bg-card border-border/50 shadow-warm hover:border-primary/30"
      } ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
    >
      <button
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
