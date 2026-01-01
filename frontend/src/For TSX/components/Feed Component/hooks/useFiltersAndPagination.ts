import { useState } from "react";
import type { Post } from "../../../For Types/posttype";

const POSTS_PER_PAGE = 10;

export const useFiltersAndPagination = (posts: Post[]) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const filteredPosts = posts
    .filter(p => selectedCategory === "All" || p.category === selectedCategory)
    .filter(p =>
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.anonymous_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount(c => c + POSTS_PER_PAGE);

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    visiblePosts,
    hasMore: visibleCount < filteredPosts.length,
    handleLoadMore,
  };
};