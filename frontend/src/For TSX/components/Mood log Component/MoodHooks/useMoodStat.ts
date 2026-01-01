// import type { MoodEntry } from "./useMoodStorage";

// export const useMoodStats = (moodEntries: MoodEntry[], moods: { label: string }[]) => {
//   const daysTracked = new Set(moodEntries.map((e) => e.date)).size;

//   const monthlyAverages = (() => {
//     const months: Record<string, number[]> = {};

//     moodEntries.forEach((entry) => {
//       const monthKey = new Date(entry.date).toLocaleString("en-US", {
//         month: "long",
//         year: "numeric",
//       });
//       const moodValue =
//         moods.findIndex((m) => m.label === entry.label) + 1 || 3;
//       if (!months[monthKey]) months[monthKey] = [];
//       months[monthKey].push(moodValue);
//     });

//     return Object.entries(months).map(([month, values]) => {
//       const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
//       return { month, average: avg.toFixed(1) };
//     });
//   })();

//   return { daysTracked, monthlyAverages };
// };
import { useEffect, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import type { MoodEntry } from "./useMoodStorage";

export const useMoodStats = (
  moodEntries: MoodEntry[],
  moods: { label: string }[]
) => {
  const [daysTracked, setDaysTracked] = useState(0);
  const [monthlyAverages, setMonthlyAverages] = useState<
    { month: string; average: string }[]
  >([]);

  // ✅ LOCAL FALLBACK (your original logic)
  const computeLocalStats = () => {
    const days = new Set(moodEntries.map((e) => e.date)).size;

    const months: Record<string, number[]> = {};

    moodEntries.forEach((entry) => {
      const monthKey = new Date(entry.date).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      const moodValue =
        moods.findIndex((m) => m.label === entry.label) + 1 || 3;

      if (!months[monthKey]) months[monthKey] = [];
      months[monthKey].push(moodValue);
    });

    const localAverages = Object.entries(months).map(([month, values]) => {
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      return { month, average: avg.toFixed(1) };
    });

    setDaysTracked(days);
    setMonthlyAverages(localAverages);
  };

  useEffect(() => {
    const loadInsights = async () => {
      try {
        // ✅ 1. TRY API FIRST
        const res = await axiosInstance.get("/api/moods/insights");

        if (res.data?.daysTracked != null && res.data?.monthlyAverages) {
          setDaysTracked(res.data.daysTracked);
          setMonthlyAverages(res.data.monthlyAverages);
          return;
        }
      } catch {
        // ✅ silently fall back
      }

      // ✅ 2. FALL BACK TO LOCAL IF API FAILS
      computeLocalStats();
    };

    loadInsights();
  }, [moodEntries]);

  return { daysTracked, monthlyAverages };
};
