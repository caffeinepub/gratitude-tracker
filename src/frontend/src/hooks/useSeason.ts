import { useState, useEffect } from "react";

export type Season = "spring" | "summer" | "autumn" | "winter";

function detectSeason(): Season {
  const now = new Date();
  const month = now.getMonth(); // 0-11

  // Detect hemisphere by timezone offset sign
  // Negative offset = west of UTC (Americas), positive = east (Europe/Asia/Oceania)
  // Use Intl to get timezone name and check for southern hemisphere countries
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const southernHemispherePrefixes = [
    "Australia", "Pacific/Auckland", "Pacific/Fiji", "Pacific/Apia",
    "America/Argentina", "America/Sao_Paulo", "America/Santiago",
    "America/Montevideo", "America/Asuncion", "Africa/Johannesburg",
    "Africa/Harare", "Africa/Nairobi", "Indian/Mauritius",
  ];
  const isSouthern = southernHemispherePrefixes.some((prefix) =>
    tz.startsWith(prefix)
  );

  // Northern hemisphere seasons
  // Spring: Mar(2)–May(4), Summer: Jun(5)–Aug(7), Autumn: Sep(8)–Nov(10), Winter: Dec(11)–Feb(1)
  let season: Season;
  if (month >= 2 && month <= 4) {
    season = "spring";
  } else if (month >= 5 && month <= 7) {
    season = "summer";
  } else if (month >= 8 && month <= 10) {
    season = "autumn";
  } else {
    season = "winter";
  }

  // Invert for southern hemisphere
  if (isSouthern) {
    const invert: Record<Season, Season> = {
      spring: "autumn",
      summer: "winter",
      autumn: "spring",
      winter: "summer",
    };
    return invert[season];
  }

  return season;
}

export function useSeason(): Season {
  const [season, setSeason] = useState<Season>(() => detectSeason());

  useEffect(() => {
    setSeason(detectSeason());
  }, []);

  return season;
}
