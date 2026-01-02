// import { useState } from "react";
// import type { MoodEntry } from "./useMoodStorage";

// type MoodOption = { emoji: string; label: string };

// export const useMoodActions = (
//   moodEntries: MoodEntry[],
//   setMoodEntries: React.Dispatch<React.SetStateAction<MoodEntry[]>>,
//   toLocalYMD: (d: Date | string) => string,
//   USER_MOOD_KEY: string,
//   moods: MoodOption[] // pass the moods so we can find emoji for selected label
// ) => {
//   const [selectedMood, setSelectedMood] = useState<string | null>(null);
//   const [note, setNote] = useState("");
//   const [showNoteInput, setShowNoteInput] = useState(false);
//   const [customEmoji, setCustomEmoji] = useState<string | null>(null);
//   const [showCustomInput, setShowCustomInput] = useState(false);

//   // helper: get emoji for a label (falls back to customEmoji or a neutral emoji)
//   const emojiForLabel = (label: string | null) => {
//     if (!label) return "🙂";
//     const found = moods.find((m) => m.label === label);
//     if (found) return found.emoji;
//     if (label === "Custom" && customEmoji) return customEmoji;
//     return "🙂";
//   };

//   const writeAndDedupe = (newEntries: MoodEntry[]) => {
//     // normalize date and dedupe by date (keep the newest — entry earlier in array overwrites)
//     const map = new Map<string, MoodEntry>();
//     for (const e of newEntries) {
//       const key = toLocalYMD(e.date);
//       map.set(key, { ...e, date: key });
//     }
//     const result = Array.from(map.values());
//     try {
//       localStorage.setItem(USER_MOOD_KEY, JSON.stringify(result));
//     } catch {
//       // ignore
//     }
//     setMoodEntries(result);
//   };

//   const handleMoodSelect = (label: string, emoji: string) => {
//     if (label === "Custom") {
//       setShowCustomInput(true);
//       return;
//     }

//     setShowCustomInput(false);
//     setSelectedMood(label);
//     setShowNoteInput(true);
//     const today = toLocalYMD(new Date());

//     // Update today's entry or add it (deduped)
//     const existing = moodEntries.find((e) => e.date === today);
//     let updated: MoodEntry[];
//     if (existing) {
//       updated = moodEntries.map((e) =>
//         e.date === today ? { ...e, label, emoji, date: today } : e
//       );
//     } else {
//       updated = [{ label, emoji, date: today }, ...moodEntries];
//     }
//     writeAndDedupe(updated);
//   };

//   const handleCustomEmojiSave = () => {
//     if (!customEmoji) return;
//     setSelectedMood("Custom");
//     setShowCustomInput(false);
//     setShowNoteInput(true);

//     const today = toLocalYMD(new Date());
//     const existing = moodEntries.find((e) => e.date === today);
//     let updated: MoodEntry[];
//     if (existing) {
//       updated = moodEntries.map((e) =>
//         e.date === today
//           ? { ...e, label: "Custom", emoji: customEmoji, date: today }
//           : e
//       );
//     } else {
//       updated = [{ label: "Custom", emoji: customEmoji, date: today }, ...moodEntries];
//     }
//     writeAndDedupe(updated);
//   };

//   const handleNoteChange = (value: string) => {
//     setNote(value);
//     const today = toLocalYMD(new Date());
//     const existing = moodEntries.find((e) => e.date === today);

//     if (existing) {
//       const updated = moodEntries.map((e) =>
//         e.date === today ? { ...e, note: value } : e
//       );
//       writeAndDedupe(updated);
//       return;
//     }

//     // no existing — create one only if we have a selected mood
//     if (selectedMood) {
//       const emoji = emojiForLabel(selectedMood);
//       const newEntry: MoodEntry = {
//         label: selectedMood,
//         emoji,
//         date: today,
//         note: value,
//       };
//       writeAndDedupe([newEntry, ...moodEntries]);
//     }
//   };

//   return {
//     selectedMood,
//     note,
//     showNoteInput,
//     customEmoji,
//     showCustomInput,
//     setNote,
//     setCustomEmoji,
//     setShowNoteInput,
//     setSelectedMood,
//     handleMoodSelect,
//     handleCustomEmojiSave,
//     handleNoteChange,
//   };
// };
import { useState } from "react";
import type { MoodEntry } from "./useMoodStorage";
import axiosInstance from "../../../../api/axiosInstance";

type MoodOption = { emoji: string; label: string };

export const useMoodActions = (
  moodEntries: MoodEntry[],
  setMoodEntries: React.Dispatch<React.SetStateAction<MoodEntry[]>>,
  toLocalYMD: (d: Date | string) => string,
  USER_MOOD_KEY: string,
  moods: MoodOption[]
) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [customEmoji, setCustomEmoji] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const getEmojiForLabel = (label: string) => {
    const found = moods.find((m) => m.label === label);
    return found?.emoji || customEmoji || "🙂";
  };

  const upsertToday = async (entry: Partial<MoodEntry>) => {
    const today = toLocalYMD(new Date());

    const updated: MoodEntry[] = moodEntries.some((e) => e.date === today)
      ? moodEntries.map((e) =>
          e.date === today ? { ...e, ...entry, date: today } : e
        )
      : [
          {
            date: today,
            label: entry.label!,
            emoji: entry.emoji!,
            note: entry.note,
          },
          ...moodEntries,
        ];

    // ✅ Update UI instantly
    setMoodEntries(updated);

    // ✅ Sync to server (POST or PUT)
    try {
      const todayEntry = updated.find((e) => e.date === today);
      if (!todayEntry) return;

      // 🔥 PUT if id exists
      if (todayEntry.id) {
        const res = await axiosInstance.put(`/api/moods/${todayEntry.id}`, {
          label: todayEntry.label,
          emoji: todayEntry.emoji,
          note: todayEntry.note,
          date: todayEntry.date,
        });

        if (res.data?.id) {
          setMoodEntries((prev) =>
            prev.map((m) => (m.date === today ? { ...m, ...res.data } : m))
          );
        }
      }

      // 🔥 POST if no id yet
      else {
        const res = await axiosInstance.post(`/api/moods`, {
          label: todayEntry.label,
          emoji: todayEntry.emoji,
          note: todayEntry.note,
          date: todayEntry.date,
        });

        if (res.data?.id) {
          setMoodEntries((prev) =>
            prev.map((m) => (m.date === today ? { ...m, id: res.data.id } : m))
          );
        }
      }
    } catch (err) {
      console.error("Mood sync failed:", err);
    }
  };

  const handleMoodSelect = (label: string, emoji: string) => {
    if (label === "Custom") {
      setShowCustomInput(true);
      return;
    }

    setSelectedMood(label);
    setShowCustomInput(false);
    setShowNoteInput(true);

    upsertToday({ label, emoji });
  };

  const handleCustomEmojiSave = () => {
    if (!customEmoji) return;

    setSelectedMood("Custom");
    setShowCustomInput(false);
    setShowNoteInput(true);

    upsertToday({ label: "Custom", emoji: customEmoji });
  };

  const handleNoteChange = (value: string) => {
    setNote(value);

    if (!selectedMood) return;

    const emoji = getEmojiForLabel(selectedMood);
    upsertToday({
      label: selectedMood,
      emoji,
      note: value,
    });
  };

  // ⭐ NEW: DELETE mood from history
  const deleteMood = async (id: string) => {
    // Remove from UI instantly
    setMoodEntries((prev) => prev.filter((m) => m.id !== id));

    // Sync delete to server
    try {
      await axiosInstance.delete(`/api/moods/${id}`);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return {
    selectedMood,
    note,
    showNoteInput,
    customEmoji,
    showCustomInput,
    setNote,
    setCustomEmoji,
    setShowNoteInput,
    setSelectedMood,
    handleMoodSelect,
    handleCustomEmojiSave,
    handleNoteChange,

    // ⭐ return delete function
    deleteMood,
  };
};
