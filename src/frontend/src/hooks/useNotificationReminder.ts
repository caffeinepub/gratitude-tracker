import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "gratitude_reminder";

interface ReminderPrefs {
  enabled: boolean;
  time: string; // "HH:MM" format
}

interface UseNotificationReminderReturn {
  enabled: boolean;
  reminderTime: string;
  permissionStatus: NotificationPermission | "unsupported";
  setEnabled: (val: boolean) => void;
  setReminderTime: (time: string) => void;
  requestPermission: () => Promise<void>;
}

function loadPrefs(): ReminderPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { enabled: false, time: "08:00" };
}

function savePrefs(prefs: ReminderPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

function msUntilTime(timeStr: string): number {
  const now = new Date();
  const [hours, minutes] = timeStr.split(":").map(Number);
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

export function useNotificationReminder(): UseNotificationReminderReturn {
  const [prefs, setPrefs] = useState<ReminderPrefs>(loadPrefs);
  const [permissionStatus, setPermissionStatus] = useState<
    NotificationPermission | "unsupported"
  >(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }
    return Notification.permission;
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearScheduled = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(
    (timeStr: string) => {
      clearScheduled();
      const ms = msUntilTime(timeStr);
      timeoutRef.current = setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("🌱 Time to water your gratitude garden!", {
            body: "Add something you're grateful for today and watch your garden grow.",
            icon: "/assets/generated/plant-tree.dim_256x320.png",
          });
        }
        // Schedule next day
        scheduleNext(timeStr);
      }, ms);
    },
    [clearScheduled]
  );

  useEffect(() => {
    if (
      prefs.enabled &&
      permissionStatus === "granted" &&
      "Notification" in window
    ) {
      scheduleNext(prefs.time);
    } else {
      clearScheduled();
    }
    return () => clearScheduled();
  }, [prefs.enabled, prefs.time, permissionStatus, scheduleNext, clearScheduled]);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermissionStatus(result);
  }, []);

  const setEnabled = useCallback(
    (val: boolean) => {
      const updated = { ...prefs, enabled: val };
      setPrefs(updated);
      savePrefs(updated);
      if (val && permissionStatus !== "granted") {
        requestPermission();
      }
    },
    [prefs, permissionStatus, requestPermission]
  );

  const setReminderTime = useCallback(
    (time: string) => {
      const updated = { ...prefs, time };
      setPrefs(updated);
      savePrefs(updated);
    },
    [prefs]
  );

  return {
    enabled: prefs.enabled,
    reminderTime: prefs.time,
    permissionStatus,
    setEnabled,
    setReminderTime,
    requestPermission,
  };
}
