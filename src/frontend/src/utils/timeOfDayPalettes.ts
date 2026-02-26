import type { TimePeriod } from "../hooks/useTimeOfDay";

export interface TimeOfDayPalette {
  skyGradient: string;
  cloudOpacity: number;
  nightOverlayOpacity: number;
  sunColor: string;
  sunGlow: string;
  moonColor: string;
  moonGlow: string;
}

const palettes: Record<TimePeriod, TimeOfDayPalette> = {
  night: {
    skyGradient: "linear-gradient(to bottom, oklch(0.18 0.08 270) 0%, oklch(0.22 0.06 260) 40%, oklch(0.28 0.05 250) 100%)",
    cloudOpacity: 0.2,
    nightOverlayOpacity: 0.55,
    sunColor: "#fff",
    sunGlow: "rgba(255,255,255,0.2)",
    moonColor: "#e8e8d0",
    moonGlow: "rgba(220,220,180,0.35)",
  },
  dawn: {
    skyGradient: "linear-gradient(to bottom, oklch(0.38 0.12 280) 0%, oklch(0.65 0.18 30) 50%, oklch(0.85 0.14 70) 100%)",
    cloudOpacity: 0.6,
    nightOverlayOpacity: 0.15,
    sunColor: "#ffb347",
    sunGlow: "rgba(255,179,71,0.5)",
    moonColor: "#e8e8d0",
    moonGlow: "rgba(220,220,180,0.2)",
  },
  morning: {
    skyGradient: "linear-gradient(to bottom, oklch(0.62 0.16 240) 0%, oklch(0.78 0.12 220) 50%, oklch(0.90 0.08 80) 100%)",
    cloudOpacity: 0.75,
    nightOverlayOpacity: 0,
    sunColor: "#ffe066",
    sunGlow: "rgba(255,224,102,0.45)",
    moonColor: "#e8e8d0",
    moonGlow: "rgba(220,220,180,0.1)",
  },
  midday: {
    skyGradient: "linear-gradient(to bottom, oklch(0.55 0.18 240) 0%, oklch(0.72 0.14 220) 60%, oklch(0.88 0.10 200) 100%)",
    cloudOpacity: 0.8,
    nightOverlayOpacity: 0,
    sunColor: "#fff9c4",
    sunGlow: "rgba(255,249,196,0.5)",
    moonColor: "#e8e8d0",
    moonGlow: "rgba(220,220,180,0.1)",
  },
  dusk: {
    skyGradient: "linear-gradient(to bottom, oklch(0.42 0.14 280) 0%, oklch(0.62 0.20 30) 40%, oklch(0.78 0.18 55) 70%, oklch(0.85 0.14 70) 100%)",
    cloudOpacity: 0.65,
    nightOverlayOpacity: 0.1,
    sunColor: "#ff7043",
    sunGlow: "rgba(255,112,67,0.55)",
    moonColor: "#e8e8d0",
    moonGlow: "rgba(220,220,180,0.15)",
  },
  evening: {
    skyGradient: "linear-gradient(to bottom, oklch(0.22 0.10 270) 0%, oklch(0.32 0.08 260) 50%, oklch(0.42 0.06 250) 100%)",
    cloudOpacity: 0.25,
    nightOverlayOpacity: 0.42,
    sunColor: "#fff",
    sunGlow: "rgba(255,255,255,0.2)",
    moonColor: "#e8e8d0",
    moonGlow: "rgba(220,220,180,0.3)",
  },
};

export function getTimeOfDayPalette(period: TimePeriod): TimeOfDayPalette {
  return palettes[period];
}
