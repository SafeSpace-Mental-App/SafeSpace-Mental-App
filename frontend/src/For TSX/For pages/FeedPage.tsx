import Navbar from "../components/Common Component/Navbar";
import Header from "../components/Common Component/Header";
import React, { useState } from "react";
import styles from "./FeedPage.module.css";
import SearchBar from "../components/Common Component/SearchBar";
import CategoryTabs from "../components/Common Component/CategoryTabs";
import PostCard from "../components/Feed Component/PostCard";
import NewPostModal from "../components/Feed Component/NewPostModal";

interface Post {
  id: number;
  username: string;
  content: string;
  time: string;
}

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPost = (content: string) => {
    const newPost: Post = {
      id: Date.now(),
      username: "You", // replace later with actual username
      content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className={styles.feedContainer}>
      {/* Header */}
      <Header />
      {/* <Header title="Feed" onAddPost={() => setIsModalOpen(true)} /> */}


      {/* Floating Button in top-right corner */}
      <button
        className={styles.newPostBtn}
        onClick={() => setIsModalOpen(true)}
      >
        +
      </button>

      {/* Search & Tabs */}
      <div className={styles.searchSection}>
        <SearchBar />
        <CategoryTabs />
      </div>

      {/* Posts */}
      <div className={styles.postsSection}>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className={styles.emptyText}>
            No posts yet. Be the first to share something!
          </p>
        )}
      </div>

      {/* Bottom Navigation */}
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
