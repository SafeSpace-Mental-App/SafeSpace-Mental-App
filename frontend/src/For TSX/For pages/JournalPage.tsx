import { useState, useEffect } from "react";
import Navbar from "../components/Common Component/Navbar";
import Header from "../components/Common Component/Header";
import styles from "./JournalPage.module.css";

interface Note {
  id: number;
  text: string;
  date: string;
}

const JournalPage = () => {
  const [note, setNote] = useState<string>("");
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("journal-notes");
    if (saved) setSavedNotes(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("journal-notes", JSON.stringify(savedNotes));
  }, [savedNotes]);

  const saveNote = () => {
    if (!note.trim()) return;
    const newNote: Note = {
      id: Date.now(),
      text: note,
      date: new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }),
    };
    setSavedNotes([newNote, ...savedNotes]);
    setNote("");
  };

  const deleteNote = (id: number) => {
    setSavedNotes(savedNotes.filter((n) => n.id !== id));
  };

  return (
    <div className={styles.container}>
      <Header title="MY JOURNAL" />

      {/* WRITE AREA - BIG AND CLEAR */}
      <div className={styles.inputCard}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Pour your heart here... no one will see this but you"
          className={styles.textarea}
          rows={8}
        />
        <button onClick={saveNote} className={styles.saveBtn}>
          Save to Journal
        </button>
      </div>

      {/* SAVED NOTES */}
      <div className={styles.notesContainer}>
        {savedNotes.length === 0 ? (
          <p className={styles.empty}>Your journal is empty. Start writing</p>
        ) : (
          savedNotes.map((item) => (
            <div key={item.id} className={styles.noteCard}>
              <p className={styles.noteText}>{item.text}</p>
              <p className={styles.noteDate}>{item.date}</p>
              <button
                onClick={() => deleteNote(item.id)}
                className={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default JournalPage;