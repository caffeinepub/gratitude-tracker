import { useRef, useState, useEffect, useMemo } from "react";
import { VolumeX, Camera, Share2, Send, X } from "lucide-react";
import { toast } from "sonner";
import type { GratitudeEntry } from "../backend";
import { groupEntriesByCategory } from "../utils/plantGrouping";
import Plant from "./Plant";
import { Bird } from "./Bird";
import { useBirdAnimation } from "../hooks/useBirdAnimation";
import { useSeason } from "../hooks/useSeason";
import { useTimeOfDay } from "../hooks/useTimeOfDay";
import { getSeasonalPalette } from "../utils/seasonalPalettes";
import { getTimeOfDayPalette } from "../utils/timeOfDayPalettes";
import { FallingParticles } from "./FallingParticles";

interface PlantGardenProps {
  entries: GratitudeEntry[];
}

// Stars for night/evening sky
function Stars({ count = 40, opacity = 1 }: { count?: number; opacity?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 55,
        size: 0.8 + Math.random() * 1.8,
        op: 0.4 + Math.random() * 0.6,
        delay: Math.random() * 3,
      })),
    [count]
  );

  return (
    <>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.op * opacity,
            animation: `star-twinkle ${2 + s.delay}s ease-in-out infinite alternate`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </>
  );
}

// Decorative SVG horizon trees/bushes with seasonal colors and advanced watercolor treatment
function HorizonDecor({ season }: { season: ReturnType<typeof useSeason> }) {
  const palette = getSeasonalPalette(season);
  const f1 = palette.horizonFoliage1;
  const f2 = palette.horizonFoliage2;
  const trunk = "oklch(0.35 0.08 60)";

  return (
    <svg
      className="absolute bottom-0 left-0 w-full"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      style={{ height: 120, zIndex: 1 }}
      aria-hidden="true"
    >
      <defs>
        {/* Main horizon watercolor displacement */}
        <filter id="horizon-wc" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.022 0.03" numOctaves={4} seed={19} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={7} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="1.2" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        {/* Bleed/feather edge for hills */}
        <filter id="horizon-bleed" x="-15%" y="-20%" width="130%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="turbulence" baseFrequency="0.03 0.045" numOctaves={3} seed={33} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={18} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="3" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        {/* Trunk texture */}
        <filter id="trunk-wc" x="-15%" y="-5%" width="130%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.1 0.02" numOctaves={3} seed={7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={3} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* Hill gradients */}
        <linearGradient id="hill-far-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={f1} stopOpacity="0.55" />
          <stop offset="100%" stopColor={f2} stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="hill-near-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={f2} stopOpacity="0.7" />
          <stop offset="100%" stopColor={f1} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Rolling hills — bleed outer wash */}
      <path
        d="M0,75 Q150,15 300,55 Q450,95 600,35 Q750,-5 900,45 Q1050,85 1200,55 L1200,120 L0,120 Z"
        fill={f1}
        opacity="0.18"
        filter="url(#horizon-bleed)"
      />
      {/* Rolling hills — main layer */}
      <path
        d="M0,80 Q150,20 300,60 Q450,100 600,40 Q750,0 900,50 Q1050,90 1200,60 L1200,120 L0,120 Z"
        fill="url(#hill-far-grad)"
        filter="url(#horizon-wc)"
      />
      {/* Rolling hills — mid-tone layer */}
      <path
        d="M0,85 Q120,45 260,65 Q400,85 540,50 Q680,15 820,55 Q960,85 1200,65 L1200,120 L0,120 Z"
        fill={f1}
        opacity="0.22"
        filter="url(#horizon-wc)"
      />
      {/* Near hills — bleed */}
      <path
        d="M0,90 Q200,50 400,75 Q600,100 800,65 Q1000,40 1200,75 L1200,120 L0,120 Z"
        fill={f2}
        opacity="0.18"
        filter="url(#horizon-bleed)"
      />
      {/* Near hills — main */}
      <path
        d="M0,95 Q200,55 400,80 Q600,105 800,70 Q1000,45 1200,80 L1200,120 L0,120 Z"
        fill="url(#hill-near-grad)"
        filter="url(#horizon-wc)"
      />
      {/* Near hills — dark base */}
      <path
        d="M0,100 Q150,70 300,85 Q450,100 600,78 Q750,58 900,75 Q1050,90 1200,82 L1200,120 L0,120 Z"
        fill={f2}
        opacity="0.2"
        filter="url(#horizon-wc)"
      />

      {/* OAK tree */}
      <g transform="translate(60, 10)" opacity="0.5">
        <rect x="14" y="55" width="8" height="45" fill={trunk} filter="url(#trunk-wc)" />
        <rect x="16" y="57" width="3" height="41" fill="oklch(0.55 0.10 65)" fillOpacity="0.4" />
        <ellipse cx="18" cy="45" rx="30" ry="20" fill={f1} opacity="0.18" filter="url(#horizon-bleed)" />
        <ellipse cx="18" cy="45" rx="28" ry="18" fill={f1} opacity="0.65" filter="url(#horizon-wc)" />
        <ellipse cx="8" cy="50" rx="16" ry="12" fill={f2} opacity="0.38" filter="url(#horizon-wc)" />
        <ellipse cx="28" cy="50" rx="16" ry="12" fill={f2} opacity="0.38" filter="url(#horizon-wc)" />
        <ellipse cx="18" cy="38" rx="20" ry="14" fill={f2} opacity="0.28" filter="url(#horizon-wc)" />
        <ellipse cx="14" cy="40" rx="10" ry="8" fill={f1} opacity="0.2" filter="url(#horizon-wc)" />
      </g>

      {/* CYPRESS tree */}
      <g transform="translate(145, 5)" opacity="0.45">
        <rect x="9" y="70" width="5" height="40" fill={trunk} filter="url(#trunk-wc)" />
        <rect x="10" y="72" width="2" height="36" fill="oklch(0.55 0.10 65)" fillOpacity="0.4" />
        <ellipse cx="11" cy="55" rx="10" ry="32" fill={f1} opacity="0.18" filter="url(#horizon-bleed)" />
        <ellipse cx="11" cy="55" rx="8" ry="30" fill={f1} opacity="0.65" filter="url(#horizon-wc)" />
        <ellipse cx="11" cy="45" rx="6" ry="22" fill={f2} opacity="0.35" filter="url(#horizon-wc)" />
        <ellipse cx="11" cy="35" rx="4" ry="15" fill={f2} opacity="0.28" filter="url(#horizon-wc)" />
      </g>

      {/* LOLLIPOP tree */}
      <g transform="translate(220, 20)" opacity="0.48">
        <rect x="10" y="50" width="6" height="40" fill={trunk} filter="url(#trunk-wc)" />
        <rect x="11" y="52" width="2.5" height="36" fill="oklch(0.55 0.10 65)" fillOpacity="0.4" />
        <circle cx="13" cy="38" r="24" fill={f1} opacity="0.18" filter="url(#horizon-bleed)" />
        <circle cx="13" cy="38" r="22" fill={f1} opacity="0.65" filter="url(#horizon-wc)" />
        <circle cx="13" cy="38" r="17" fill={f2} opacity="0.35" filter="url(#horizon-wc)" />
        <circle cx="10" cy="33" r="8" fill={f1} opacity="0.22" filter="url(#horizon-wc)" />
        <circle cx="8" cy="32" r="3" fill="oklch(0.75 0.22 50)" opacity="0.7" />
        <circle cx="18" cy="30" r="2.5" fill="oklch(0.72 0.20 30)" opacity="0.7" />
        <circle cx="6" cy="42" r="2" fill="oklch(0.78 0.18 80)" opacity="0.7" />
        <circle cx="20" cy="44" r="2.5" fill="oklch(0.70 0.22 60)" opacity="0.7" />
      </g>

      {/* Standard tree */}
      <g transform="translate(310, 25)" opacity="0.4">
        <rect x="7" y="45" width="5" height="35" fill={trunk} filter="url(#trunk-wc)" />
        <rect x="8" y="47" width="2" height="31" fill="oklch(0.55 0.10 65)" fillOpacity="0.4" />
        <ellipse cx="9" cy="38" rx="14" ry="20" fill={f1} opacity="0.18" filter="url(#horizon-bleed)" />
        <ellipse cx="9" cy="38" rx="12" ry="18" fill={f1} opacity="0.65" filter="url(#horizon-wc)" />
        <ellipse cx="7" cy="34" rx="7" ry="10" fill={f2} opacity="0.28" filter="url(#horizon-wc)" />
      </g>

      {/* Bush cluster */}
      <g transform="translate(390, 55)" opacity="0.5">
        <ellipse cx="18" cy="20" rx="24" ry="16" fill={f1} opacity="0.18" filter="url(#horizon-bleed)" />
        <ellipse cx="18" cy="20" rx="22" ry="14" fill={f1} opacity="0.65" filter="url(#horizon-wc)" />
        <ellipse cx="8" cy="22" rx="14" ry="10" fill={f2} opacity="0.38" filter="url(#horizon-wc)" />
        <ellipse cx="28" cy="22" rx="14" ry="10" fill={f2} opacity="0.38" filter="url(#horizon-wc)" />
        <ellipse cx="18" cy="14" rx="10" ry="7" fill={f1} opacity="0.22" filter="url(#horizon-wc)" />
      </g>

      {/* Willow-style drooping tree */}
      <g transform="translate(500, 0)" opacity="0.42">
        <rect x="10" y="60" width="6" height="50" fill={trunk} filter="url(#trunk-wc)" />
        <rect x="11" y="62" width="2.5" height="46" fill="oklch(0.55 0.10 65)" fillOpacity="0.4" />
        <ellipse cx="13" cy="40" rx="24" ry="20" fill={f1} opacity="0.18" filter="url(#horizon-bleed)" />
        <ellipse cx="13" cy="40" rx="22" ry="18" fill={f1} opacity="0.65" filter="url(#horizon-wc)" />
        <path d="M5 45 Q0 80 3 110" stroke={f2} strokeWidth="3" fill="none" opacity="0.6" filter="url(#horizon-wc)" />
        <path d="M13 42 Q10 85 12 115" stroke={f2} strokeWidth="3" fill="none" opacity="0.6" filter="url(#horizon-wc)" />
        <path d="M21 45 Q26 80 23 110" stroke={f2} strokeWidth="3" fill="none" opacity="0.6" filter="url(#horizon-wc)" />
        <path d="M5 45 Q1 75 4 105" stroke={f1} strokeWidth="1.5" fill="none" opacity="0.28" filter="url(#horizon-wc)" />
        <path d="M21 45 Q25 75 22 105" stroke={f1} strokeWidth="1.5" fill="none" opacity="0.28" filter="url(#horizon-wc)" />
      </g>

      {/* Magnolia-style tree */}
      <g transform="translate(600, 15)" opacity="0.44">
        <rect x="10" y="55" width="7" height="45" fill={trunk} filter="url(#trunk-wc)" />
        <rect x="11" y="57" width="3" height="41" fill="oklch(0.55 0.10 65)" fillOpacity="0.4" />
        <ellipse cx="13" cy="42" rx="26" ry="22" fill={f1} opacity="0.18" filter="url(#horizon-bleed)" />
        <ellipse cx="13" cy="42" rx="24" ry="20" fill={f1} opacity="0.65" filter="url(#horizon-wc)" />
        <ellipse cx="5" cy="48" rx="14" ry="12" fill={f2} opacity="0.35" filter="url(#horizon-wc)" />
        <ellipse cx="22" cy="48" rx="14" ry="12" fill={f2} opacity="0.35" filter="url(#horizon-wc)" />
        <ellipse cx="13" cy="34" rx="12" ry="10" fill={f1} opacity="0.22" filter="url(#horizon-wc)" />
      </g>

      {/* OAK tree right side */}
      <g transform="translate(860, 8)" opacity="0.45">
        <rect x="14" y="55" width="8" height="45" fill={trunk} filter="url(#trunk-wc)" />
        <rect x="16" y="57" width="3" height="41" fill="oklch(0.55 0.10 65)" fillOpacity="0.4" />
        <ellipse cx="18" cy="45" rx="28" ry="19" fill={f1} opacity="0.18" filter="url(#horizon-bleed)" />
        <ellipse cx="18" cy="45" rx="26" ry="17" fill={f1} opacity="0.65" filter="url(#horizon-wc)" />
        <ellipse cx="8" cy="50" rx="15" ry="11" fill={f2} opacity="0.38" filter="url(#horizon-wc)" />
        <ellipse cx="28" cy="50" rx="15" ry="11" fill={f2} opacity="0.38" filter="url(#horizon-wc)" />
        <ellipse cx="18" cy="38" rx="18" ry="13" fill={f2} opacity="0.28" filter="url(#horizon-wc)" />
        <ellipse cx="14" cy="40" rx="9" ry="7" fill={f1} opacity="0.2" filter="url(#horizon-wc)" />
      </g>

      {/* CYPRESS right */}
      <g transform="translate(960, 0)" opacity="0.42">
        <rect x="9" y="70" width="5" height="40" fill={trunk} filter="url(#trunk-wc)" />
        <rect x="10" y="72" width="2" height="36" fill="oklch(0.55 0.10 65)" fillOpacity="0.4" />
        <ellipse cx="11" cy="55" rx="10" ry="32" fill={f1} opacity="0.18" filter="url(#horizon-bleed)" />
        <ellipse cx="11" cy="55" rx="8" ry="30" fill={f1} opacity="0.65" filter="url(#horizon-wc)" />
        <ellipse cx="11" cy="45" rx="6" ry="22" fill={f2} opacity="0.35" filter="url(#horizon-wc)" />
        <ellipse cx="11" cy="35" rx="4" ry="15" fill={f2} opacity="0.28" filter="url(#horizon-wc)" />
      </g>

      {/* LOLLIPOP right */}
      <g transform="translate(1040, 18)" opacity="0.46">
        <rect x="10" y="50" width="6" height="40" fill={trunk} filter="url(#trunk-wc)" />
        <rect x="11" y="52" width="2.5" height="36" fill="oklch(0.55 0.10 65)" fillOpacity="0.4" />
        <circle cx="13" cy="38" r="22" fill={f1} opacity="0.18" filter="url(#horizon-bleed)" />
        <circle cx="13" cy="38" r="20" fill={f1} opacity="0.65" filter="url(#horizon-wc)" />
        <circle cx="13" cy="38" r="15" fill={f2} opacity="0.35" filter="url(#horizon-wc)" />
        <circle cx="10" cy="33" r="7" fill={f1} opacity="0.22" filter="url(#horizon-wc)" />
        <circle cx="8" cy="32" r="2.5" fill="oklch(0.75 0.22 50)" opacity="0.7" />
        <circle cx="18" cy="30" r="2" fill="oklch(0.72 0.20 30)" opacity="0.7" />
        <circle cx="6" cy="42" r="2" fill="oklch(0.78 0.18 80)" opacity="0.7" />
        <circle cx="20" cy="44" r="2" fill="oklch(0.70 0.22 60)" opacity="0.7" />
      </g>

      {/* Standard tree far right */}
      <g transform="translate(1130, 22)" opacity="0.38">
        <rect x="7" y="42" width="5" height="32" fill={trunk} filter="url(#trunk-wc)" />
        <rect x="8" y="44" width="2" height="28" fill="oklch(0.55 0.10 65)" fillOpacity="0.4" />
        <ellipse cx="9" cy="36" rx="15" ry="21" fill={f1} opacity="0.18" filter="url(#horizon-bleed)" />
        <ellipse cx="9" cy="36" rx="13" ry="19" fill={f1} opacity="0.65" filter="url(#horizon-wc)" />
        <ellipse cx="7" cy="32" rx="7" ry="11" fill={f2} opacity="0.28" filter="url(#horizon-wc)" />
      </g>
    </svg>
  );
}

// Keyframe styles for sound-wave indicator bars
const SOUND_WAVE_STYLE = `
@keyframes sound-bar-pulse {
  0%, 100% { transform: scaleY(0.4); opacity: 0.7; }
  50% { transform: scaleY(1); opacity: 1; }
}
`;

export default function PlantGarden({ entries }: PlantGardenProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [shareCaption, setShareCaption] = useState("");
  const pianoRef = useRef<HTMLAudioElement | null>(null);
  const birdsRef = useRef<HTMLAudioElement | null>(null);
  const leavesRef = useRef<HTMLAudioElement | null>(null);
  const gardenRef = useRef<HTMLDivElement>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Season and time-of-day detection
  const season = useSeason();
  const timeOfDay = useTimeOfDay();
  const seasonPalette = getSeasonalPalette(season);
  const timePalette = getTimeOfDayPalette(timeOfDay.period);

  // Dynamic birdsong volume based on time of day
  const birdsTargetVolume = useMemo(() => {
    switch (timeOfDay.period) {
      case "morning":
      case "midday":
        return 0.35;
      case "dawn":
        return 0.28;
      case "dusk":
      case "evening":
        return 0.15;
      case "night":
      default:
        return 0.08;
    }
  }, [timeOfDay.period]);

  const plantGroups = groupEntriesByCategory(entries);
  const animatedBirds = useBirdAnimation(plantGroups, season);

  // Sun vertical position: 0=bottom, 1=top of sky area
  const sunTopPct = timeOfDay.showSun
    ? Math.max(5, 75 - timeOfDay.sunPosition * 65)
    : 100;

  // Initialize audio elements
  useEffect(() => {
    const piano = new Audio("/assets/audio/piano-melody.mp3");
    piano.loop = true;
    piano.volume = 0.45;
    piano.muted = true;
    pianoRef.current = piano;

    const birds = new Audio("/assets/audio/birdsong.mp3");
    birds.loop = true;
    birds.volume = 0.08;
    birds.muted = true;
    birdsRef.current = birds;

    const leaves = new Audio("/assets/audio/leaves-rustle.mp3");
    leaves.loop = true;
    leaves.volume = 0.20;
    leaves.muted = true;
    // Silently handle missing audio file
    leaves.onerror = () => {};
    leavesRef.current = leaves;

    piano.load();
    birds.load();
    leaves.load();

    return () => {
      piano.pause();
      birds.pause();
      leaves.pause();
      pianoRef.current = null;
      birdsRef.current = null;
      leavesRef.current = null;
    };
  }, []);

  // Sync mute state with smooth fade-in
  useEffect(() => {
    const piano = pianoRef.current;
    const birds = birdsRef.current;
    const leaves = leavesRef.current;
    if (!piano || !birds) return;

    // Clear any in-progress fade
    if (fadeIntervalRef.current !== null) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    if (!isMuted) {
      // Unmute: set volume to 0 first, then ramp up
      piano.volume = 0;
      birds.volume = 0;
      if (leaves) leaves.volume = 0;

      piano.muted = false;
      birds.muted = false;
      if (leaves) leaves.muted = false;

      piano.play().catch(() => {});
      birds.play().catch(() => {});
      if (leaves) leaves.play().catch(() => {});

      const PIANO_TARGET = 0.45;
      const BIRDS_TARGET = birdsTargetVolume;
      const LEAVES_TARGET = 0.20;
      const DURATION_MS = 1500;
      const TICK_MS = 16;
      const steps = Math.ceil(DURATION_MS / TICK_MS);
      let tick = 0;

      fadeIntervalRef.current = setInterval(() => {
        tick++;
        const t = Math.min(tick / steps, 1);
        if (pianoRef.current) pianoRef.current.volume = t * PIANO_TARGET;
        if (birdsRef.current) birdsRef.current.volume = t * BIRDS_TARGET;
        if (leavesRef.current) leavesRef.current.volume = t * LEAVES_TARGET;
        if (t >= 1 && fadeIntervalRef.current !== null) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      }, TICK_MS);
    } else {
      // Mute immediately
      piano.muted = true;
      birds.muted = true;
      if (leaves) leaves.muted = true;
    }

    return () => {
      if (fadeIntervalRef.current !== null) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    };
  }, [isMuted, birdsTargetVolume]);

  const handleSaveSnapshot = async () => {
    if (!gardenRef.current) return;
    try {
      const html2canvas = (await import(/* @vite-ignore */ "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js" as string)).default;
      const canvas = await html2canvas(gardenRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = "my-gratitude-garden.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Garden snapshot saved!");
    } catch {
      toast.error("Could not save snapshot. Please try again.");
    }
  };

  const defaultShareMessage = `🌱 My Gratitude Garden is growing! I've added ${entries.length} gratitude entr${entries.length === 1 ? "y" : "ies"}. What are you grateful for today?`;

  const openSharePanel = () => {
    setShareCaption(defaultShareMessage);
    setShowSharePanel(true);
  };

  const handleShare = async () => {
    const text = shareCaption.trim() || defaultShareMessage;
    setShowSharePanel(false);
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Gratitude Garden", text });
        toast.success("Shared successfully!");
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  const isNightTime = timeOfDay.period === "night" || timeOfDay.period === "evening";
  const cloudOpacity = timePalette.cloudOpacity;

  return (
    <div
      ref={gardenRef}
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ minHeight: 420 }}
    >
      {/* === SKY BACKGROUND (time-of-day driven) === */}
      <div
        className="absolute inset-0 transition-all duration-[120000ms]"
        style={{
          background: timePalette.skyGradient,
          zIndex: 0,
        }}
      />

      {/* === WATERCOLOR SKY WASH OVERLAY — painterly irregular texture === */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="sky-wc-wash" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves={4} seed={8} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={20} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="2" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
        </defs>
        {/* Subtle sky wash bands for painterly unevenness */}
        <rect x="0" y="0" width="100%" height="40%" fill="white" fillOpacity="0.04" filter="url(#sky-wc-wash)" />
        <rect x="0" y="10%" width="100%" height="30%" fill="white" fillOpacity="0.03" filter="url(#sky-wc-wash)" />
      </svg>

      {/* === STARS (night/evening only) === */}
      {isNightTime && (
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <Stars count={45} opacity={timePalette.nightOverlayOpacity > 0.3 ? 1 : 0.5} />
        </div>
      )}

      {/* === GARDEN BACKGROUND IMAGE === */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/assets/generated/garden-background.dim_1920x600.png')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          opacity: isNightTime ? 0.25 : 0.45,
          zIndex: 2,
        }}
      />

      {/* === WATERCOLOR CLOUDS — soft organic shapes with displacement filter === */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ zIndex: 3, height: 120, opacity: cloudOpacity }}
        aria-hidden="true"
      >
        <defs>
          <filter id="cloud-wc" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.06" numOctaves={4} seed={23} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={12} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="2.5" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
        </defs>
        {/* Cloud 1 — multi-layer watercolor */}
        <ellipse cx="15%" cy="35" rx="7%" ry="22" fill="white" fillOpacity="0.55" filter="url(#cloud-wc)" />
        <ellipse cx="12%" cy="40" rx="5%" ry="18" fill="white" fillOpacity="0.42" filter="url(#cloud-wc)" />
        <ellipse cx="18%" cy="38" rx="5.5%" ry="16" fill="white" fillOpacity="0.38" filter="url(#cloud-wc)" />
        {/* Cloud 2 */}
        <ellipse cx="72%" cy="28" rx="8%" ry="20" fill="white" fillOpacity="0.5" filter="url(#cloud-wc)" />
        <ellipse cx="68%" cy="33" rx="5%" ry="16" fill="white" fillOpacity="0.38" filter="url(#cloud-wc)" />
        <ellipse cx="76%" cy="30" rx="5.5%" ry="15" fill="white" fillOpacity="0.35" filter="url(#cloud-wc)" />
        {/* Cloud 3 */}
        <ellipse cx="45%" cy="45" rx="6%" ry="16" fill="white" fillOpacity="0.38" filter="url(#cloud-wc)" />
        <ellipse cx="42%" cy="48" rx="4%" ry="13" fill="white" fillOpacity="0.28" filter="url(#cloud-wc)" />
      </svg>

      {/* === SUN DISK === */}
      {timeOfDay.showSun && (
        <div
          className="absolute right-12 w-14 h-14 rounded-full transition-all duration-[60000ms]"
          style={{
            top: `${sunTopPct}%`,
            background: `radial-gradient(circle, ${timePalette.sunColor} 30%, ${timePalette.sunColor}cc 70%, transparent 100%)`,
            boxShadow: `0 0 35px 14px ${timePalette.sunGlow}`,
            zIndex: 3,
            opacity: 0.92,
          }}
        />
      )}

      {/* === MOON DISK === */}
      {timeOfDay.showMoon && (
        <div
          className="absolute right-16 top-10 w-11 h-11 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${timePalette.moonColor} 60%, ${timePalette.moonColor}88 100%)`,
            boxShadow: `0 0 28px 10px ${timePalette.moonGlow}`,
            zIndex: 3,
            opacity: 0.88,
          }}
        />
      )}

      {/* === HORIZON DECORATIONS (seasonal SVG trees/bushes) === */}
      <div className="absolute bottom-16 left-0 w-full" style={{ zIndex: 4 }}>
        <HorizonDecor season={season} />
      </div>

      {/* === GROUND STRIP — multi-tone watercolor wash === */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ zIndex: 5 }}
      >
        <svg
          width="100%"
          height="80"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter id="ground-wc" x="-5%" y="-10%" width="110%" height="120%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.025 0.015" numOctaves={3} seed={14} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={8} xChannelSelector="R" yChannelSelector="G" result="displaced" />
              <feGaussianBlur in="displaced" stdDeviation="0.8" result="blurred" />
              <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
            </filter>
            <linearGradient id="ground-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={seasonPalette.groundTop} stopOpacity="0.95" />
              <stop offset="50%" stopColor={seasonPalette.groundBottom} stopOpacity="0.9" />
              <stop offset="100%" stopColor={seasonPalette.groundBottom} stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Base ground */}
          <rect x="0" y="0" width="1200" height="80" fill="url(#ground-grad)" filter="url(#ground-wc)" />
          {/* Top edge highlight — lighter wash */}
          <rect x="0" y="0" width="1200" height="20" fill={seasonPalette.groundTop} fillOpacity="0.35" filter="url(#ground-wc)" />
          {/* Mid wash */}
          <rect x="0" y="18" width="1200" height="28" fill={seasonPalette.groundBottom} fillOpacity="0.18" filter="url(#ground-wc)" />
          {/* Deep bottom tone */}
          <rect x="0" y="50" width="1200" height="30" fill={seasonPalette.groundBottom} fillOpacity="0.28" filter="url(#ground-wc)" />
        </svg>
      </div>

      {/* === NIGHT OVERLAY === */}
      {timePalette.nightOverlayOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "rgba(10, 10, 40, 1)",
            opacity: timePalette.nightOverlayOpacity,
            zIndex: 8,
          }}
        />
      )}

      {/* === FALLING PARTICLES (spring petals / autumn leaves / winter snow) === */}
      <FallingParticles season={season} />

      {/* === BIRDS LAYER === */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 9 }}
        aria-hidden="true"
      >
        {animatedBirds.map((bird) => (
          <Bird key={bird.id} bird={bird} />
        ))}
      </div>

      {/* === PLANTS LAYER === */}
      <div
        className="relative flex items-end justify-center gap-8 flex-wrap px-8 pb-6 pt-16"
        style={{ minHeight: 420, zIndex: 6 }}
      >
        {plantGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4 opacity-80">🌱</div>
            <p className="font-display text-lg text-white/90 font-medium drop-shadow">
              Your garden awaits
            </p>
            <p className="font-body text-sm text-white/70 mt-1 drop-shadow">
              Add gratitude entries to grow your plants
            </p>
          </div>
        ) : (
          plantGroups.map((group) => (
            <Plant
              key={group.category}
              category={group.category}
              entries={group.entries}
              stage={group.stage}
              plantType={group.plantType}
              season={season}
            />
          ))
        )}
      </div>

      {/* === SEASON + TIME BADGE === */}
      <div
        className="absolute top-3 left-3 flex gap-1.5"
        style={{ zIndex: 11 }}
      >
        <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-sm text-white/90 border border-white/20 capitalize">
          {season}
        </span>
        <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-sm text-white/90 border border-white/20 capitalize">
          {timeOfDay.period}
        </span>
      </div>

      {/* === SHARE PANEL (inline popover) === */}
      {showSharePanel && (
        <div
          className="absolute bottom-14 right-4 w-72 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-2xl p-4"
          style={{ zIndex: 20 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-serif text-sm font-semibold text-foreground">
              Share your garden
            </span>
            <button
              type="button"
              onClick={() => setShowSharePanel(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/8 transition-all"
              aria-label="Close share panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={shareCaption}
            onChange={(e) => setShareCaption(e.target.value)}
            rows={3}
            placeholder="Add a personal message…"
            className="w-full text-xs font-body text-foreground bg-white/70 border border-border/50 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 placeholder:text-muted-foreground/50 leading-relaxed"
          />
          <button
            type="button"
            onClick={handleShare}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-body font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-warm"
          >
            <Send className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      )}

      {/* === CONTROLS === */}
      <div
        className="absolute bottom-4 right-4 flex items-center gap-1.5"
        style={{ zIndex: 11 }}
      >
        {/* Grouped pill container */}
        <div className="flex items-center gap-px rounded-full bg-black/25 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg">
          <button
            type="button"
            onClick={handleSaveSnapshot}
            className="flex items-center gap-1.5 px-3 py-2 text-white text-xs font-body hover:bg-white/20 active:bg-white/30 transition-all"
            title="Save snapshot"
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <div className="w-px h-4 bg-white/20 shrink-0" />

          <button
            type="button"
            onClick={openSharePanel}
            className="flex items-center gap-1.5 px-3 py-2 text-white text-xs font-body hover:bg-white/20 active:bg-white/30 transition-all"
            title="Share garden"
          >
            <Share2 className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <div className="w-px h-4 bg-white/20 shrink-0" />

          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            className="flex items-center gap-1.5 px-3 py-2 text-white text-xs font-body hover:bg-white/20 active:bg-white/30 transition-all"
            title={isMuted ? "Unmute ambient sounds" : "Mute ambient sounds"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="currentColor"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <rect
                  x="1" y="4" width="2.2" height="6" rx="1.1"
                  style={{
                    transformOrigin: "50% 100%",
                    animation: "sound-bar-pulse 0.9s ease-in-out infinite",
                    animationDelay: "0ms",
                  }}
                />
                <rect
                  x="5.9" y="2" width="2.2" height="10" rx="1.1"
                  style={{
                    transformOrigin: "50% 100%",
                    animation: "sound-bar-pulse 0.9s ease-in-out infinite",
                    animationDelay: "150ms",
                  }}
                />
                <rect
                  x="10.8" y="4" width="2.2" height="6" rx="1.1"
                  style={{
                    transformOrigin: "50% 100%",
                    animation: "sound-bar-pulse 0.9s ease-in-out infinite",
                    animationDelay: "300ms",
                  }}
                />
              </svg>
            )}
            <span className="hidden sm:inline">{isMuted ? "Sound" : "Mute"}</span>
          </button>
        </div>
      </div>

      {/* Sound-wave keyframe styles */}
      <style>{SOUND_WAVE_STYLE}</style>
    </div>
  );
}
