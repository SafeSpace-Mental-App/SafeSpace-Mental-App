import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Common Component/Navbar";
import Header from "../Common Component/Header";
import styles from "./FeedPage.module.css";
import SearchBar from "../Common Component/SearchBar";
import CategoryTabs from "./CategoryTabs";
import PostCard from "./PostCard";
import NewPostModal from "./NewPostModal";
import Spinner from "../ReusableField/Spinner";


// ─────────────────────────────────────────────
// Import custom hooks
// ─────────────────────────────────────────────
import { useFeed } from "./hooks/useFeed";
import { useAuth } from "./hooks/useAuth";
import { usePostActions } from "./hooks/usePostActions";
import { useFiltersAndPagination } from "./hooks/useFiltersAndPagination";

// import { useSyncedLikes } from "./hooks/useSyncedLikes";

const FeedPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { posts, setPosts, loading, error } = useFeed();
  const { currentUsername, checkAuth } = useAuth();

  const {
    handleAddPost,
    handleDeletePost,
    handleToggleLike,
    handleAddComment,
    handleDeleteComment,
  } = usePostActions(posts, setPosts);

  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    visiblePosts,
    hasMore,
    handleLoadMore,
  } = useFiltersAndPagination(posts);
  // useSyncedLikes(posts, setPosts);
  if (loading) {
    return (
      <p className={styles.emptyText}>
        <Spinner />
      </p>
    );
  }

  return (
    <div className={styles.feedContainer}>
      {/* Header */}
      <Header
        className={styles.headerEdit}
        title="Safe Rant"
        subtitles="Express yourself freely"
        onAddPost={() => checkAuth(() => setIsModalOpen(true))}
      />

      {/* Guest Banner */}
      {(!localStorage.getItem("token") ||
        localStorage.getItem("token") === "null") && (
        <div className={styles.guestBanner}>
          <p>Ready to share your story?</p>
          <button
            onClick={() => navigate("/signup")}
            className={styles.joinBtn}
          >
            Join SafeSpace — It's Free
          </button>
        </div>
      )}

      {/* Offline Indicator */}
      {error && (
        <div className={styles.offlineBar}>
          <div className={styles.offlinePulse}></div>
          <span className={styles.offlineText}>
            Offline Mode • Your posts are saved locally
          </span>
          <div className={styles.offlineWave}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}

      {/* Search + Category */}
      <div className={styles.searchSection}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Posts List */}
      <div className={styles.postsSection}>
        {visiblePosts.length > 0 ? (
          visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showDelete={post.username === currentUsername}
              onDelete={handleDeletePost}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          ))
        ) : (
          <p className={styles.emptyText}>No posts found.</p>
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

      <Navbar />

      {/* New Post Modal */}
      <NewPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPost={handleAddPost}
      />
    </div>
  );
};

export default FeedPage;
