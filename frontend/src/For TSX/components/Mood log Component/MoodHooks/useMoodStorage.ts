// import { useEffect, useState } from "react";

// export type MoodEntry = {
//   emoji: string;
//   label: string;
//   date: string; // always normalized "YYYY-MM-DD"
//   note?: string;
// };

// export const useMoodStorage = () => {
//   const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

//   const currentUserId = localStorage.getItem("currentUserId") || "guest";
//   const USER_MOOD_KEY = `moodEntries_${currentUserId}`;

//   const toLocalYMD = (d: Date | string) => {
//     const dt = typeof d === "string" ? new Date(d) : d;
//     const year = dt.getFullYear();
//     const month = String(dt.getMonth() + 1).padStart(2, "0");
//     const day = String(dt.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   // Load and normalize entries once (normalize date field to YYYY-MM-DD)
//   useEffect(() => {
//     const saved = localStorage.getItem(USER_MOOD_KEY);
//     if (saved) {
//       try {
//         const parsed: unknown = JSON.parse(saved);
//         if (Array.isArray(parsed)) {
//           const normalized = parsed
//             .map((p) => {
//               // best-effort normalization
//               try {
//                 const asAny = p as any;
//                 return {
//                   emoji: String(asAny.emoji ?? ""),
//                   label: String(asAny.label ?? ""),
//                   date: toLocalYMD(asAny.date ?? new Date()),
//                   note: typeof asAny.note === "string" ? asAny.note : undefined,
//                 } as MoodEntry;
//               } catch {
//                 return null;
//               }
//             })
//             .filter(Boolean) as MoodEntry[];

//           // dedupe by date keeping the newest (first occurrence in file means newest saved)
//           const map = new Map<string, MoodEntry>();
//           for (const e of normalized) {
//             map.set(e.date, e);
//           }
//           const deduped = Array.from(map.values());
//           setMoodEntries(deduped);
//         } else {
//           setMoodEntries([]);
//         }
//       } catch {
//         setMoodEntries([]);
//       }
//     } else {
//       setMoodEntries([]);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentUserId]);

//   // Persist on change (persist normalized, deduped)
//   useEffect(() => {
//     if (moodEntries.length >= 0) {
//       // ensure stored entries are normalized and deduped by date
//       const map = new Map<string, MoodEntry>();
//       // keep the newest first behaviour: we'll iterate moodEntries in order and overwrite older ones
//       for (const e of moodEntries) {
//         const key = toLocalYMD(e.date);
//         map.set(key, { ...e, date: key });
//       }
//       const toStore = Array.from(map.values());
//       try {
//         localStorage.setItem(USER_MOOD_KEY, JSON.stringify(toStore));
//       } catch {
//         // ignore localStorage set errors
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [moodEntries]);

//   return {
//     moodEntries,
//     setMoodEntries,
//     currentUserId,
//     USER_MOOD_KEY,
//     toLocalYMD,
//   };
// };
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";

export type MoodEntry = {
  id?: string;
  emoji: string;
  label: string;
  date: string;
  note?: string;
};

export const useMoodStorage = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const didHydrate = useRef(false); // ✅ blocks double save
  const didLoadOnce = useRef(false); // ✅ blocks empty overwrite

  const currentUserId = localStorage.getItem("currentUserId") || "guest";
  const USER_MOOD_KEY = `moodEntries_${currentUserId}`;

  const toLocalYMD = (d: Date | string) => {
    const dt = typeof d === "string" ? new Date(d) : d;
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ✅ LOAD FROM API FIRST, FALLBACK TO LOCAL
  useEffect(() => {
    const loadMoods = async () => {
      try {
        // ✅ 1. Load from server
        const res = await axiosInstance.get("/api/moods");

        if (Array.isArray(res.data)) {
          setMoodEntries(res.data);

          // ✅ 2. Save server copy to localStorage
          localStorage.setItem(USER_MOOD_KEY, JSON.stringify(res.data));
          didLoadOnce.current = true;
          return;
        }
      } catch (err) {
        console.warn(err, "API load failed, using local backup");
      }

      // ✅ 3. Fallback to localStorage if API fails
      try {
        const saved = localStorage.getItem(USER_MOOD_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setMoodEntries(parsed);
          }
        }
      } catch {
        // never clear on error
      } finally {
        didLoadOnce.current = true;
      }
    };

    loadMoods();
  }, [USER_MOOD_KEY]);

  // ✅ SAVE — BLOCKED UNTIL AFTER REAL LOAD
  useEffect(() => {
    if (!didLoadOnce.current) return;

    // ✅ CRITICAL FIX: BLOCK FIRST EMPTY DEV SAVE
    if (!didHydrate.current) {
      didHydrate.current = true;
      return;
    }

    try {
      localStorage.setItem(USER_MOOD_KEY, JSON.stringify(moodEntries));
    } catch {
      // ignore
    }
  }, [moodEntries, USER_MOOD_KEY]);

  return {
    moodEntries,
    setMoodEntries,
    currentUserId,
    USER_MOOD_KEY,
    toLocalYMD,
  };
};
