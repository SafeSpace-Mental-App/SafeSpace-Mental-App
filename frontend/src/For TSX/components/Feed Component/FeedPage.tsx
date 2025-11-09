import React, { useState, useEffect } from "react";
import Navbar from "../Common Component/Navbar";
import Header from "../Common Component/Header";
import styles from "./FeedPage.module.css";
import SearchBar from "../Common Component/SearchBar";
import CategoryTabs from "./CategoryTabs";
import PostCard from "./PostCard";
import NewPostModal from "./NewPostModal";
import axiosInstance from "../../../api/axiosInstance";
import type { Post } from "../../For Types/posttype";

const POSTS_PER_PAGE = 10;

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Dummy fallback posts
  const dummyPosts: Post[] = [
    {
      id: "1",
      title: "Tough Day at Work",
      content:
        "Today was super stressful but I managed to stay calm. What do you suggest I do?",
      category: "Work",
      username: "User1",
      likes: 2,
      likedByUser: false,
      comments: [
        { id: "c1", username: "Friend", text: "Hang in there!" },
        { id: "c2", username: "Colleague", text: "Try taking a short break." },
      ],
      visibility: "public",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Feeling Anxious Lately",
      content:
        "Been struggling with anxiety again, trying deep breaths and journaling.",
      category: "Anxiety",
      username: "User2",
      likes: 4,
      likedByUser: false,
      comments: [],
      visibility: "public",
      createdAt: new Date().toISOString(),
    },
  ];

  // ---- Helpers for local persistence + outbox ----
  const LOCAL_KEY = "userPosts"; // local cache of posts
  const OUTBOX_KEY = "outboxPosts"; // posts that failed to send to server

  const getCurrentUsername = () => {
    const stored = localStorage.getItem("username");
    const userEmail = localStorage.getItem("email"); // in case username not set
    if (stored && stored.trim()) return stored;
    if (userEmail && userEmail.includes("@")) return userEmail.split("@")[0]; // extract before @
    return "Anonymous";
  };

  const getOutbox = (): Post[] => {
    try {
      const raw = localStorage.getItem(OUTBOX_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };
  const saveOutbox = (arr: Post[]) =>
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(arr));
  const saveLocalPosts = (arr: Post[]) =>
    localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));

  // Attempt to sync outbox posts to server (called on start and after successful auth)
  const syncOutbox = async () => {
    const outbox = getOutbox();
    if (!outbox.length) return;

    const remaining: Post[] = [];
    for (const p of outbox) {
      try {
        // try to POST; backend should return saved post
        const res = await axiosInstance.post("/api/feeds/create", {
          title: p.title,
          content: p.content,
          category: p.category,
          visibility: p.visibility,
          username: p.username,
        });
        const saved = res.data;
        // replace local temp post with saved from server (match by temp id)
        setPosts((prev) => {
          // remove any temp post with same temp id, then add saved at top
          const filtered = prev.filter((x) => x.id !== p.id);
          return [saved, ...filtered];
        });
      } catch (err) {
        // keep it in outbox if still failing
        remaining.push(p);
      }
    }
    saveOutbox(remaining);
  };

  // Load posts from local cache first, then fetch from server; finally attempt to sync outbox
  useEffect(() => {
    // load cached posts for immediate UI
    const cached = localStorage.getItem(LOCAL_KEY);
    if (cached) {
      try {
        setPosts(JSON.parse(cached));
      } catch {
        // ignore parse error
      }
    }

    const fetchAndSync = async () => {
      try {
        const res = await axiosInstance.get("/api/feeds");
        if (res.data?.feeds && res.data.feeds.length > 0) {
          setPosts(res.data.feeds);
          saveLocalPosts(res.data.feeds);
        } else {
          // Use cached or dummy when server returns empty
          if (!cached) setPosts(dummyPosts);
        }
      } catch (err) {
        console.error("Error loading posts:", err);
        setError("Failed to load posts. Showing cached/sample feed.");
        // if no cached posts, show dummy
        if (!cached) setPosts(dummyPosts);
      } finally {
        setLoading(false);
        // Try sync outbox after initial fetch attempt
        try {
          await syncOutbox();
        } catch (e) {
          // ignore
        }
      }
    };

    fetchAndSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to local cache whenever posts change
  useEffect(() => {
    if (posts.length) saveLocalPosts(posts);
  }, [posts]);

  // ---- Create new post: optimistic UI + outbox on failure ----
  const handleAddPost = async (
    content: string,
    category: string,
    title?: string,
    visibility?: string
  ) => {
    const finalTitle = title?.trim()
      ? title
      : content.slice(0, 40) || "Untitled Post";
    const finalVisibility = visibility ?? "public";
    const username = getCurrentUsername() || "You";

    // create a temporary local post immediately for snappy UI
    const tempId = `tmp-${Date.now()}`;
    const tempPost: Post = {
      id: tempId,
      title: finalTitle,
      content,
      category,
      username,
      likes: 0,
      likedByUser: false,
      comments: [],
      visibility: finalVisibility,
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => [tempPost, ...prev]);

    try {
      const res = await axiosInstance.post("/api/feeds/create", {
        title: finalTitle,
        content,
        category,
        visibility: finalVisibility,
        username,
      });
      const saved = res.data;
      // Replace temp post with saved server post
      setPosts((prev) => {
        const withoutTemp = prev.filter((p) => p.id !== tempId);
        return [saved, ...withoutTemp];
      });
    } catch (err) {
      console.warn("Create post failed — saved to outbox for later sync", err);
      // Put it into outbox to sync later
      const outbox = getOutbox();
      outbox.push(tempPost);
      saveOutbox(outbox);
    } finally {
      setIsModalOpen(false);
    }
  };

  // ---- Delete post: check ownership client-side, then call server, fallback local delete ----
  const handleDeletePost = async (id: string) => {
    const currentUser = getCurrentUsername();
    const target = posts.find((p) => p.id === id);
    if (!target) return;

    // Client-side ownership guard
    if (target.username !== currentUser) {
      alert("You can only delete your own posts.");
      return;
    }

    // Optimistically remove from UI
    setPosts((prev) => prev.filter((p) => p.id !== id));

    try {
      await axiosInstance.delete(`/api/feeds/${id}`);
      // success — already removed
    } catch (err) {
      console.warn("Failed to delete on server, local deleted remains.", err);
      // If server delete fails, keep local removal (or re-add depending on desired behavior)
    }
  };

  // ---- Like toggle (optimistic + server call) ----
  const handleToggleLike = async (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              likedByUser: !post.likedByUser,
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
    try {
      await axiosInstance.put(`/api/feeds/${id}/like`);
    } catch (err) {
      console.warn("Like API failed (offline?)", err);
    }
  };

  // ---- Comments handlers ----
  const handleAddComment = async (postId: string, text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      username: getCurrentUsername() || "You",
      text,
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );

    try {
      await axiosInstance.post(`/api/replies/${postId}`, { text });
    } catch (err) {
      console.warn("Failed adding comment to server (offline fallback):", err);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter((c) => c.id !== commentId),
            }
          : post
      )
    );

    try {
      await axiosInstance.delete(`/api/replies/${commentId}`);
    } catch (err) {
      console.warn("Failed deleting comment on server (offline):", err);
    }
  };

  // ---- Filtering, pagination, UI ----
  const filteredPosts = posts
    .filter((post) =>
      selectedCategory === "All" ? true : post.category === selectedCategory
    )
    .filter(
      (post) =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + POSTS_PER_PAGE);

  if (loading) return <p className={styles.emptyText}>Loading posts...</p>;

  return (
    <div className={styles.feedContainer}>
      <Header
        title="Safe Rant"
        subtitles="Express yourself freely"
        onAddPost={() => setIsModalOpen(true)}
      />

      {error && <p className={styles.errorText}>{error}</p>}

      <div className={styles.searchSection}>
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
              showDelete={post.username === getCurrentUsername()} // 👈 only show delete for own posts
              onDelete={(id) => handleDeletePost(id)}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          ))
        ) : (
          <p className={styles.emptyText}>No posts found.</p>
        )}
      </div>

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
