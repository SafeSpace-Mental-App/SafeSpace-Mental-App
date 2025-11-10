import { useEffect, useState } from "react";
import Navbar from "../Common Component/Navbar";
import Header from "../Common Component/Header";
import style from "../Mood log Component/MoodLog.module.css";
import { FiTrendingUp, FiCalendar } from "react-icons/fi";

interface MoodEntry {
  emoji: string;
  label: string;
  date: string; // e.g. "2025-11-07"
  note?: string;
}

const MoodPage = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [customEmoji, setCustomEmoji] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const currentUserId = localStorage.getItem("currentUserId") || "guest";
  const USER_MOOD_KEY = `moodEntries_${currentUserId}`;

  const moods = [
    { emoji: "😞", label: "Very Low" },
    { emoji: "🙁", label: "Low" },
    { emoji: "😐", label: "Okay" },
    { emoji: "🙂", label: "Good" },
    { emoji: "😁", label: "Great" },
    { emoji: "➕", label: "Custom" },
  ];

  const toLocalYMD = (d: Date | string) => {
    const dt = typeof d === "string" ? new Date(d) : d;
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem(USER_MOOD_KEY);
    if (saved) {
      try {
        setMoodEntries(JSON.parse(saved));
      } catch {
        setMoodEntries([]);
      }
    }
  }, [currentUserId]);

  useEffect(() => {
    if (moodEntries.length > 0) {
      localStorage.setItem(USER_MOOD_KEY, JSON.stringify(moodEntries));
    }
  }, [moodEntries]);

  const handleMoodSelect = (label: string, emoji: string) => {
    if (label === "Custom") {
      setShowCustomInput(true);
      return;
    }
    setShowCustomInput(false);
    setSelectedMood(label);
    setShowNoteInput(true);
    const today = toLocalYMD(new Date());
    setMoodEntries((prev) => {
      const existing = prev.find((e) => toLocalYMD(e.date) === today);
      let updated: MoodEntry[];
      if (existing) {
        updated = prev.map((e) =>
          toLocalYMD(e.date) === today ? { ...e, label, emoji, date: today } : e
        );
      } else {
        updated = [{ label, emoji, date: today }, ...prev];
      }
      localStorage.setItem(USER_MOOD_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleCustomEmojiSave = () => {
    if (!customEmoji) return;
    setSelectedMood("Custom");
    setShowCustomInput(false);
    setShowNoteInput(true);
    const today = toLocalYMD(new Date());
    setMoodEntries((prev) => {
      const existing = prev.find((e) => toLocalYMD(e.date) === today);
      let updated: MoodEntry[];
      if (existing) {
        updated = prev.map((e) =>
          toLocalYMD(e.date) === today
            ? { ...e, label: "Custom", emoji: customEmoji, date: today }
            : e
        );
      } else {
        updated = [
          { label: "Custom", emoji: customEmoji, date: today },
          ...prev,
        ];
      }
      localStorage.setItem(USER_MOOD_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleNoteChange = (value: string) => {
    setNote(value);
    const today = toLocalYMD(new Date());
    setMoodEntries((prev) => {
      const existing = prev.find((e) => toLocalYMD(e.date) === today);
      let updated: MoodEntry[];
      if (existing) {
        updated = prev.map((e) =>
          toLocalYMD(e.date) === today ? { ...e, note: value } : e
        );
      } else if (selectedMood) {
        updated = [
          { label: selectedMood, emoji: "🙂", date: today, note: value },
          ...prev,
        ];
      } else {
        updated = [...prev];
      }
      localStorage.setItem(USER_MOOD_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const daysTracked = new Set(moodEntries.map((e) => toLocalYMD(e.date))).size;

  const monthlyAverages = (() => {
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
    return Object.entries(months).map(([month, values]) => {
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      return { month, average: avg.toFixed(1) };
    });
  })();

  return (
    <>
      <div className={style.moodPage}>
        {currentUserId === "guest" && (
          <div className={style.guestBanner}>
            Guest mode • Sign up to keep your moods forever
          </div>
        )}
        <Header
          title="Mood Log"
          subtitles="Track your emotional journey day by day"
          className={style.headerEdit}
        />

        {!showFullHistory ? (
          <>
            {/* Mood Check-in */}
            <section className={style.moodCheckin}>
              <h2>How are you feeling today?</h2>
              <p>Track your emotional wellbeing with a quick mood check-in</p>
              <div className={style.moodOptions}>
                {moods.map((mood) => (
                  <button
                    key={mood.label}
                    className={`${style.moodBtn} ${
                      selectedMood === mood.label ? style.activeMood : ""
                    }`}
                    onClick={() => handleMoodSelect(mood.label, mood.emoji)}
                  >
                    <div className={style.emoji}>{mood.emoji}</div>
                    <p className={style.label}>{mood.label}</p>
                  </button>
                ))}
              </div>

              {showCustomInput && (
                <div className={style.customEmojiBox}>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="Enter emoji"
                    value={customEmoji || ""}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    className={style.customEmojiInput}
                  />
                  <button
                    onClick={handleCustomEmojiSave}
                    className={style.saveCustomBtn}
                  >
                    Save
                  </button>
                </div>
              )}

              {/* Note input */}
              <div
                className={`${style.noteBox} ${
                  showNoteInput ? style.noteBoxVisible : ""
                }`}
              >
                {showNoteInput && (
                  <>
                    <textarea
                      className={style.noteInput}
                      placeholder="Add a short note about your day (max 30 chars)..."
                      maxLength={30}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <button
                      className={style.saveNoteBtn}
                      onClick={() => {
                        handleNoteChange(note);
                        setShowNoteInput(false);
                      }}
                    >
                      Save Note
                    </button>
                  </>
                )}
              </div>
            </section>

            {/* Stats Section */}
            <section className={style.moodStats}>
              <div className={style.sectionHeader}>
                <h3 className={style.moodEntriesTitle}>
                  <FiTrendingUp /> Your Mood Entries
                </h3>
                <h5>Based on your recent entries</h5>
              </div>

              <div className={style.statsBox}>
                <div>
                  <h4>
                    {moodEntries.length
                      ? (
                          moodEntries.reduce(
                            (sum, e) =>
                              sum +
                              (moods.findIndex((m) => m.label === e.label) + 1),
                            0
                          ) / moodEntries.length
                        ).toFixed(1)
                      : "–"}
                  </h4>
                  <p>Average Mood</p>
                </div>
                <div>
                  <h4>{daysTracked}</h4>
                  <p>Days Tracked</p>
                </div>
              </div>
              <div className={style.aiInsight}>
                {(() => {
                  if (moodEntries.length === 0)
                    return "💡 Start today — one log changes everything.";
                  const sorted = [...moodEntries].sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  );
                  const streak = sorted
                    .slice(0, 7)
                    .filter((e) => e.label === sorted[0]?.label).length;
                  if (streak >= 5)
                    return `💡 ${streak} days of ${sorted[0].label} — you're on fire. Keep protecting this energy.`;
                  if (streak >= 3)
                    return `💡 ${streak} days strong. Momentum is real.`;
                  if (moodEntries.length >= 30)
                    return "💡 30 days of showing up. You're not like the rest.";
                  return "💡 Every log is a vote for who you're becoming.";
                })()}
              </div>

              <div className={style.privacyNote}>
                Your moods are 100% private • Never leave your phone
              </div>
            </section>

            {/* Recent Entries */}
            <section className={style.recentEntries}>
              <h3>
                <FiCalendar /> Recent Entries
              </h3>
              <h5>Your mood over the past few days</h5>
              <ul className={style.moodentries}>
                {moodEntries.length > 0 ? (
                  (() => {
                    const sorted = [...moodEntries].sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
                    const todayLocal = toLocalYMD(new Date());
                    const todayEntry = sorted.find(
                      (e) => toLocalYMD(e.date) === todayLocal
                    );
                    const others = sorted.filter(
                      (e) => toLocalYMD(e.date) !== todayLocal
                    );
                    const displayEntries = [
                      ...(todayEntry ? [todayEntry] : []),
                      ...others.slice(0, todayEntry ? 4 : 5),
                    ];
                    return displayEntries.map((entry) => (
                      <li key={entry.date}>
                        <span>{entry.emoji}</span>
                        <div>
                          <p className={style.date}>
                            {(() => {
                              const entryDate = new Date(entry.date);
                              const entryLocal = toLocalYMD(entryDate);
                              const today = toLocalYMD(new Date());
                              const diffDays = Math.floor(
                                (new Date(today).getTime() -
                                  new Date(entryLocal).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              );
                              if (diffDays === 0) return "Today";
                              if (diffDays === 1) return "Yesterday";
                              return entryDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                weekday: "long",
                              });
                            })()}
                          </p>
                          <p className={style.recentEntriesText}>
                            {entry.note ? entry.note : `Feeling ${entry.label}`}
                          </p>
                        </div>
                        <span
                          className={`${style.tag} ${
                            style[
                              entry.label.toLowerCase().replace(/\s/g, "")
                            ] || style.okay
                          }`}
                        >
                          {entry.label}
                        </span>
                      </li>
                    ));
                  })()
                ) : (
                  <p>No mood entries yet</p>
                )}
              </ul>

              <button
                className={style.viewBtn}
                onClick={() => setShowFullHistory(true)}
              >
                View Full History
              </button>
            </section>
          </>
        ) : (
          <>
            {/* Full History View */}
            <section className={style.recentEntries}>
              <h3>
                <FiCalendar /> Full Mood History
              </h3>
              <h5>Your complete mood journey</h5>

              <ul className={style.moodentries}>
                {moodEntries.length > 0 ? (
                  [...moodEntries]
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((entry) => (
                      <li key={entry.date}>
                        <span>{entry.emoji}</span>
                        <div>
                          <p className={style.date}>
                            {(() => {
                              const entryDate = new Date(entry.date);
                              const entryLocal = toLocalYMD(entryDate);
                              const today = toLocalYMD(new Date());
                              const diffDays = Math.floor(
                                (new Date(today).getTime() -
                                  new Date(entryLocal).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              );
                              if (diffDays === 0) return "Today";
                              if (diffDays === 1) return "Yesterday";
                              return entryDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                weekday: "long",
                              });
                            })()}
                          </p>
                          <p className={style.recentEntriesText}>
                            {entry.note ? entry.note : `Feeling ${entry.label}`}
                          </p>
                        </div>
                        <span
                          className={`${style.tag} ${
                            style[
                              entry.label.toLowerCase().replace(/\s/g, "")
                            ] || style.okay
                          }`}
                        >
                          {entry.label}
                        </span>
                      </li>
                    ))
                ) : (
                  <p>No mood entries yet</p>
                )}
              </ul>

              <div className={style.monthlyOverview}>
                <h4>
                  <FiTrendingUp /> Monthly Mood Overview
                </h4>
                <ul className={style.moodentries}>
                  {monthlyAverages.length > 0 ? (
                    monthlyAverages.map((month) => {
                      const monthEntries = moodEntries.filter(
                        (entry) =>
                          new Date(entry.date).toLocaleString("en-US", {
                            month: "long",
                            year: "numeric",
                          }) === month.month
                      );

                      const daysInMonth = new Set(
                        monthEntries.map((entry) => toLocalYMD(entry.date))
                      ).size;

                      const moodCount: Record<string, number> = {};
                      monthEntries.forEach((entry) => {
                        moodCount[entry.label] =
                          (moodCount[entry.label] || 0) + 1;
                      });
                      const dominantMood =
                        Object.keys(moodCount).length > 0
                          ? Object.entries(moodCount).sort(
                              (a, b) => b[1] - a[1]
                            )[0][0]
                          : "No data";

                      return (
                        <li key={month.month} className={style.monthCard}>
                          <div className={style.monthHeader}>
                            <h5>{month.month}</h5>
                          </div>
                          <div className={style.statMoodcontainer}>
                            <p className={style.subMood}>
                              Mostly {dominantMood}
                            </p>
                            <div className={style.statsRow}>
                              <span className={style.tag}>
                                Avg: {month.average}
                              </span>
                              <span className={style.tag}>
                                {daysInMonth} Days Tracked
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <p>No monthly data yet</p>
                  )}
                </ul>
              </div>

              <button
                className={style.viewBtn}
                onClick={() => setShowFullHistory(false)}
              >
                Back to Recent Entries
              </button>
            </section>
          </>
        )}

        <Navbar />
      </div>
    </>
  );
};

export default MoodPage;
