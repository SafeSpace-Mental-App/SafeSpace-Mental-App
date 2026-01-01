import { useState, useEffect, useMemo } from "react";
import Navbar from "../Common Component/Navbar";
import Header from "../Common Component/Header";
import styles from "./JournalPage.module.css";
import SearchBar from "../Common Component/SearchBar";
import NewJournalModal from "./NewJournalModal";
import useJournalFilterhook from "./hooks/useJournalFilterhook";

// hooks
import useJournalPostAction from "./hooks/useJournalPostAction";
import { useJournalFeed } from "../Journal Component/hooks/useJournalFeed";
import JournalPostCard from "./JournalPostCard";
import type { journalPost } from "../../For Types/posttype";
import EditPostModal from "./EditPostModal";

interface Note {
  id: number;
  text: string;
  date: string;
}

function countWords(text: string | null | undefined): number {
  const safe = typeof text === "string" ? text : "";
  const trimmed = safe.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

const TotalWordCount = (words: journalPost[]) => {
  return words.reduce((total, x) => {
    const bodyCount = countWords(x.content);
    return total + bodyCount;
  }, 0);
};

const JournalPage = () => {
  const { posts, setPosts } = useJournalFeed();
  // const [note, setNote] = useState<string>("");

  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { handleAddPost, handleDeletePost, handleSaveEditPost } =
    useJournalPostAction(posts, setPosts);
  const { searchQuery, setSearchQuery, hasMore, handleLoadMore, visibleCount } =
    useJournalFilterhook(posts);

  //DISPLAY TOTAL WORDS
  const wordCount = useMemo(() => {
    const total = TotalWordCount(posts);
    const last = posts[posts.length - 1];
    if (last) {
      console.log("Last post:", { title: last.title, content: last.content });
      console.log("Counts:", {
        titleWords: countWords(last.title),
        contentWords: countWords(last.content),
      });
    }
    return total;
  }, [posts]);

  const [editingPost, setEditingPost] = useState<journalPost | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("journal-notes");
    if (saved) setSavedNotes(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("journal-notes", JSON.stringify(savedNotes));
  }, [savedNotes]);
  return (
    <div className={styles.container}>
      <Header title="Personal Journal " className={styles.journalHeader} />

      {/* For Analytics */}
      <div className={styles.journalContainer}>
        <div className={styles.NumberJournal}>
          <p className={styles.number}>{posts.length}</p>

          <p className={styles.text}>Journal Entries</p>
        </div>
        <div className={styles.NumberJournal}>
          <p className={styles.number}>{wordCount}</p>
          <p className={styles.text}>Words Written</p>
        </div>
      </div>

      {/* SEARCH SECTION */}

      <div className={styles.postSectionSearch}>
        <SearchBar
          value={searchQuery}
          className={styles.searchBar}
          onChange={setSearchQuery}
        />
      </div>

      {/* POST SECTION */}
      <div className={styles.postSection}>
        {visibleCount.length > 0 ? (
          visibleCount.map((post) => (
            <JournalPostCard
              key={post.id}
              contents={post}
              onDelete={handleDeletePost}
              onOpenEditModal={() => {
                setEditingPost(post);
                setIsEditModalOpen(true);
              }}
            />
          ))
        ) : (
          <p className={styles.EmptyJournal}>Journal is Empty</p>
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className={styles.loadMoreWrapper}>
          <button onClick={handleLoadMore} className={styles.loadMoreBtn}>
            Load More
          </button>
        </div>
      )}
      <div className={styles.startWrittingContainer}>
        <p className={styles.startWrittingP1}>Today's Writing Prompt</p>
        <p className={styles.startWrittingP2}>
          A gentle nudge to get your thoughts flowing
        </p>
        <p className={styles.TodayPrompt}>
          <i>
            "What is one thing you're proud of yourself for this week, no matter
            how small?"
          </i>
        </p>
        <button
          className={styles.startWritting}
          onClick={() => setIsModalOpen(true)}
        >
          Start writting
        </button>
      </div>

      {isModalOpen && (
        <NewJournalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPost={handleAddPost}
        />
      )}
      {isEditModalOpen && editingPost && (
        <EditPostModal
          isOpen={isEditModalOpen}
          journalContent={editingPost}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPost(null);
          }}
          onSave={(content, title) => {
            handleSaveEditPost(editingPost.id, content, title);
          }}
        />
      )}

      <Navbar />
    </div>
  );
};

export default JournalPage;
