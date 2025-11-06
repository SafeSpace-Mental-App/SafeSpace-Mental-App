import React, { useState, useEffect } from "react";
import Navbar from "../Common Component/Navbar";
import Header from "../Common Component/Header";
import styles from "./FeedPage.module.css";
import SearchBar from "../Common Component/SearchBar";
import CategoryTabs from "./CategoryTabs";
import PostCard from "./PostCard";
import NewPostModal from "./NewPostModal";

interface Comment {
  id: number;
  text: string;
}

interface Post {
  id: number;
  username: string;
  content: string;
  time: string;
  category: string;
  likes: number;
  comments: Comment[];
}

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ Load from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (err) {
        console.error("Failed to parse saved posts:", err);
      }
    }
    setIsInitialized(true);
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }, [posts, isInitialized]);

  const handleAddPost = (content: string, category: string) => {
    const newPost: Post = {
      id: Date.now(),
      username: "You",
      content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      category,
      likes: 0,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePost = (id: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const handleToggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: post.likes === 0 ? 1 : 0 } : post
      )
    );
  };

  // ✅ Add Comment
  const handleAddComment = (postId: number, text: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { id: Date.now(), text }],
            }
          : post
      )
    );
  };

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className={styles.feedContainer}>
      <Header title="Safe Rant" onAddPost={() => setIsModalOpen(true)} />

      <div className={styles.searchSection}>
        <SearchBar />
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div className={styles.postsSection}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
            />
          ))
        ) : (
          <p className={styles.emptyText}>No posts in this category yet.</p>
        )}
      </div>

      <Navbar />

      <NewPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPost={handleAddPost}
      />
    </div>
  );
};

export default FeedPage;
