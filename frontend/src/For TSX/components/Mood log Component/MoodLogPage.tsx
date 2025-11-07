import { useState } from "react";
import Navbar from "../Common Component/Navbar";
import Header from "../Common Component/Header";
import style from "../Mood log Component/MoodLog.module.css";
import { FiPlus } from "react-icons/fi";

const MoodPage = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { emoji: "😞", label: "Very Low" },
    { emoji: "🙁", label: "Low" },
    { emoji: "😐", label: "Okay" },
    { emoji: "🙂", label: "Good" },
    { emoji: "😁", label: "Great" },
    { icon: <FiPlus size={30} />, label: "Custom" },
  ];

  return (
    <>
      <div className={style.moodPage}>
        {/* Top Header */}
        <Header
          title="Mood Log"
          subtitles="Track your emotional journey day by day"
        />

        {/* Mood Check-in */}
        <section className={style.moodCheckin}>
          <h2>How are you feeling today?</h2>
          <div className={style.moodOptions}>
            {moods.map((mood) => (
              <button
                key={mood.label}
                className={`${style.moodBtn} ${
                  selectedMood === mood.label ? style.activeMood : ""
                }`}
                onClick={() => setSelectedMood(mood.label)}
              >
                <div className={style.emoji}>{mood.emoji || mood.icon}</div>
                <p>{mood.label}</p>
              </button>
            ))}
          </div>

          {selectedMood && (
            <p className={style.selectedMoodText}>
              You’re feeling <strong>{selectedMood}</strong> today 💫
            </p>
          )}
        </section>

        {/* Stats Section */}
        <section className={style.moodStats}>
          <h3>Your Mood Entries</h3>
          <div className={style.statsBox}>
            <div>
              <h4>3.2</h4>
              <p>Average Mood</p>
            </div>
            <div>
              <h4>5</h4>
              <p>Days Tracked</p>
            </div>
          </div>
          <div className={style.tip}>
            💡 Tip: You’ve been consistent with tracking! Keep it up to spot
            patterns.
          </div>
        </section>

        {/* Recent Entries */}
        <section className={style.recentEntries}>
          <h3>Recent Entries</h3>
          <ul className={style.moodentries}>
            <li>
              <span>😊</span>
              <div>
                <p className={style.date}>Yesterday, Oct 31</p>
                <p>Had a great day at work</p>
              </div>
              <span className={`${style.tag} ${style.good}`}>Good</span>
            </li>
            <li>
              <span>😐</span>
              <div>
                <p className={style.date}>Fri, Oct 31</p>
                <p>Feeling okay, just tired</p>
              </div>
              <span className={`${style.tag} ${style.okay}`}>Okay</span>
            </li>
            <li>
              <span>😔</span>
              <div>
                <p className={style.date}>Thu, Oct 30</p>
                <p>Stressed about deadlines</p>
              </div>
              <span className={`${style.tag} ${style.low}`}>Low</span>
            </li>
          </ul>

          <button className={style.viewBtn}>View Full History</button>
        </section>

        {/* Bottom Navigation */}
        <Navbar />
      </div>
    </>
  );
};

export default MoodPage;
