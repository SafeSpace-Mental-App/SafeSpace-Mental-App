import { useState } from "react";
import type { journalPost } from "../../../For Types/posttype";
const POSTS_PER_PAGE = 10;

const useJournalFilterhook = (journalPost: journalPost[]) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleJournal, setVisibleJournal] = useState(POSTS_PER_PAGE);

  const filterJournal = journalPost.filter(
    (x) =>
      x.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (x.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const visibleCount = filterJournal.slice(0, visibleJournal);
  const handleLoadMore = () => setVisibleJournal((c) => c + POSTS_PER_PAGE);
  const hasMore = visibleJournal < filterJournal.length;
  return { searchQuery, setSearchQuery, handleLoadMore, visibleCount, hasMore };
};

export default useJournalFilterhook;
