import { useState, useEffect } from "react";

export type TimePeriod = "night" | "dawn" | "morning" | "midday" | "dusk" | "evening";

export interface TimeOfDayState {
  period: TimePeriod;
  hour: number;
  minute: number;
  /** 0–1 progress within the current period */
  progress: number;
  /** Sun vertical position 0=horizon, 1=zenith */
  sunPosition: number;
  showSun: boolean;
  showMoon: boolean;
}

function getTimeOfDay(): TimeOfDayState {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const totalMinutes = hour * 60 + minute;

  let period: TimePeriod;
  let progress: number;

  if (totalMinutes < 5 * 60) {
    period = "night";
    progress = totalMinutes / (5 * 60);
  } else if (totalMinutes < 7 * 60) {
    period = "dawn";
    progress = (totalMinutes - 5 * 60) / (2 * 60);
  } else if (totalMinutes < 12 * 60) {
    period = "morning";
    progress = (totalMinutes - 7 * 60) / (5 * 60);
  } else if (totalMinutes < 16 * 60) {
    period = "midday";
    progress = (totalMinutes - 12 * 60) / (4 * 60);
  } else if (totalMinutes < 20 * 60) {
    period = "dusk";
    progress = (totalMinutes - 16 * 60) / (4 * 60);
  } else {
    period = "evening";
    progress = (totalMinutes - 20 * 60) / (4 * 60);
  }

  // Sun position: 0=horizon, 1=zenith
  // Dawn: 0→0.3, Morning: 0.3→0.8, Midday: 0.8→1→0.8, Dusk: 0.8→0.1, Evening/Night: hidden
  let sunPosition = 0;
  if (period === "dawn") sunPosition = progress * 0.3;
  else if (period === "morning") sunPosition = 0.3 + progress * 0.5;
  else if (period === "midday") sunPosition = 0.8 + Math.sin(progress * Math.PI) * 0.2;
  else if (period === "dusk") sunPosition = 0.8 - progress * 0.7;

  const showSun = period === "dawn" || period === "morning" || period === "midday" || period === "dusk";
  const showMoon = period === "night" || period === "evening";

  return { period, hour, minute, progress, sunPosition, showSun, showMoon };
}

export function useTimeOfDay(): TimeOfDayState {
  const [state, setState] = useState<TimeOfDayState>(() => getTimeOfDay());

  useEffect(() => {
    setState(getTimeOfDay());
    const interval = setInterval(() => {
      setState(getTimeOfDay());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return state;
}
