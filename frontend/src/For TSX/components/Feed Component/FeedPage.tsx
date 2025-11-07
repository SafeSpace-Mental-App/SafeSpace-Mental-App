// FeedPage.tsx
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

const POSTS_PER_PAGE = 10; // for "Load More" simulation

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://safe-place-sigma.vercel.app/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err: any) {
        console.error("Error loading posts:", err);
        setError("Failed to load posts. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // ✅ Create a new post
  const handleAddPost = async (content: string, category: string) => {
    const newPost: Omit<Post, "id"> = {
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

    try {
      const res = await fetch("https://safe-place-sigma.vercel.app/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error("Failed to create post");
      const savedPost = await res.json();
      setPosts((prev) => [savedPost, ...prev]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Failed to create post.");
    }
  };

  // ✅ Delete post
  const handleDeletePost = async (id: number) => {
    try {
      const res = await fetch(
        `https://safe-place-sigma.vercel.app/api/posts/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete post");
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  // ✅ Like / Unlike post
  const handleToggleLike = async (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: post.likes === 0 ? 1 : 0 } : post
      )
    );
    try {
      await fetch(`https://safe-place-sigma.vercel.app/api/posts/${id}/like`, {
        method: "POST",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Add Comment
  const handleAddComment = async (postId: number, text: string) => {
    try {
      const res = await fetch(
        `https://safe-place-sigma.vercel.app/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );
      if (!res.ok) throw new Error("Failed to add comment");
      const newComment = await res.json();
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete Comment
  const handleDeleteComment = async (postId: number, commentId: number) => {
    try {
      const res = await fetch(
        `https://safe-place-sigma.vercel.app/api/posts/${postId}/comments/${commentId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete comment");
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              }
            : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Filter, search, and paginate
  const filteredPosts = posts
    .filter((post) =>
      selectedCategory === "All" ? true : post.category === selectedCategory
    )
    .filter(
      (post) =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  if (loading) return <p className={styles.emptyText}>Loading posts...</p>;
  if (error) return <p className={styles.emptyText}>{error}</p>;

  return (
    <div className={styles.feedContainer}>
      <Header title="Safe Rant" onAddPost={() => setIsModalOpen(true)} />

      <div className={styles.searchSection}>
        {/* ✅ Updated search with value + onChange */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div className={styles.postsSection}>
        {visiblePosts.length > 0 ? (
          visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
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

      {/* ✅ Load More (simulated pagination for now) */}
      {visibleCount < filteredPosts.length && (
        <div className={styles.loadMoreWrapper}>
          <button onClick={handleLoadMore} className={styles.loadMoreBtn}>
            Load More
          </button>
        </div>
      )}

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
