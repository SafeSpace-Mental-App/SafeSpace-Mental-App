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
import { useNavigate } from "react-router-dom";

const POSTS_PER_PAGE = 10;

const FeedPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGuestBanner, setShowGuestBanner] = useState(true);

  // DUMMY POSTS (for offline)
  const dummyPosts: Post[] = [
    {
      id: "1",
      title: "Tough Day at Work",
      content:
        "Today was super stressful but I managed to stay calm. What do you suggest I do?",
      category: "Work",
      username: "user123",
      anonymous_name: "StressBuster",
      likes: 2,
      likedByUser: false,
      comments: [
        { id: "c1", username: "friend99", text: "Hang in there!" },
        {
          id: "c2",
          username: "colleague22",
          text: "Try taking a short break.",
        },
      ],
      visibility: "public",
      createdAt: new Date().toISOString(),
      time: "2:30 PM",
    },
  ];

  const LOCAL_KEY = "userPosts";
  const OUTBOX_KEY = "outboxPosts";

  // GET CURRENT USER'S ANONYMOUS NAME (NOT EMAIL!)
  const getCurrentUsername = (): string => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername && storedUsername.trim() && storedUsername !== "null") {
      return storedUsername.trim();
    }
    return "Anonymous";
  };

  const getOutbox = (): Post[] => {
    try {
      const raw = localStorage.getItem(OUTBOX_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Failed to parse outbox:", err);
      return [];
    }
  };

  const saveOutbox = (arr: Post[]) => {
    try {
      localStorage.setItem(OUTBOX_KEY, JSON.stringify(arr));
    } catch (err) {
      console.error("Failed to save outbox:", err);
    }
  };

  const saveLocalPosts = (arr: any[]) => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));
    } catch (err) {
      console.error("Failed to save local posts:", err);
    }
  };

  // SYNC OUTBOX (safe + no 401 spam)
  const syncOutbox = async () => {
    const outbox = getOutbox();
    if (!outbox.length) return;

    const remaining: Post[] = [];
    for (const p of outbox) {
      try {
        const res = await axiosInstance.post("/api/feeds/create", {
          title: p.title,
          content: p.content,
          category: p.category,
          visibility: p.visibility,
          username: p.username,
        });

        const saved = res.data.feed || res.data;

        setPosts((prev) => {
          const filtered = prev.filter((x) => x.id !== p.id);
          return [
            {
              ...saved,
              id: saved._id,
              anonymous_name:
                saved.anonymous_name || p.anonymous_name || "Anonymous",
              likes: saved.likes?.length || 0,
              likedByUser: false,
              comments: (saved.replies || []).map((r: any) => ({
                id: r._id,
                username: r.anonymous_name || "Anonymous",
                text: r.text,
              })),
              time: new Date(saved.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
            ...filtered,
          ];
        });
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.warn("Auth expired during outbox sync. Stopping.");
          break;
        }
        console.warn("Outbox post failed, keeping:", p.id);
        remaining.push(p);
      }
    }
    saveOutbox(remaining);
  };

  // FETCH POSTS + SYNC — NO REDIRECT HERE
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPosts(
          parsed.map((p: any) => ({
            ...p,
            time: p.createdAt
              ? new Date(p.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now",
          }))
        );
      } catch (err) {
        console.error("Cache parse error:", err);
      }
    }

    const fetchAndSync = async () => {
      try {
        const res = await axiosInstance.get("/api/feeds");
        if (res.data?.feeds?.length > 0) {
          const formattedPosts = res.data.feeds.map((feed: any) => ({
            id: feed._id,
            title: feed.title,
            content: feed.content,
            category: feed.category,
            username: feed.user || "Anonymous",
            anonymous_name: feed.anonymous_name || "Anonymous",
            likes: feed.likes?.length || 0,
            likedByUser: false,
            comments: (feed.replies || []).map((r: any) => ({
              id: r._id,
              username: r.anonymous_name || "Anonymous",
              text: r.text,
            })),
            visibility: feed.visibility,
            createdAt: feed.createdAt,
            time: new Date(feed.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setPosts(formattedPosts);
          saveLocalPosts(res.data.feeds);
        } else if (!cached) {
          setPosts(dummyPosts);
        }
      } catch (err: any) {
        console.error("Fetch failed:", err);
        setError("Offline mode");
        if (!cached) setPosts(dummyPosts);
      } finally {
        setLoading(false);
        try {
          await syncOutbox();
        } catch (syncErr) {
          console.error("Outbox sync error:", syncErr);
        }
      }
    };

    fetchAndSync();
  }, []);

  useEffect(() => {
    if (posts.length) {
      saveLocalPosts(posts.map((p) => ({ ...p, time: undefined })));
    }
  }, [posts]);

  // GUEST BANNER TIMER — ONLY FOR GUESTS
  // GUEST BANNER: ALWAYS VISIBLE FOR GUESTS — NO TIMER, NO SCROLL HIDE
  useEffect(() => {
    const isGuest =
      !localStorage.getItem("token") ||
      localStorage.getItem("token") === "null";
    setShowGuestBanner(isGuest);
  }, []);

  // CREATE POST — REDIRECT ONLY ON ACTION
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
    const username = getCurrentUsername();

    const tempId = `tmp-${Date.now()}`;
    const tempPost: Post = {
      id: tempId,
      title: finalTitle,
      content,
      category,
      username,
      anonymous_name: username,
      likes: 0,
      likedByUser: false,
      comments: [],
      visibility: finalVisibility,
      createdAt: new Date().toISOString(),
      time: "Just now",
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

      const saved = res.data.feed || res.data;
      setPosts((prev) => {
        const withoutTemp = prev.filter((p) => p.id !== tempId);
        return [
          {
            ...saved,
            id: saved._id,
            anonymous_name: saved.anonymous_name || username,
            likes: saved.likes?.length || 0,
            likedByUser: false,
            comments: (saved.replies || []).map((r: any) => ({
              id: r._id,
              username: r.anonymous_name || "Anonymous",
              text: r.text,
            })),
            time: new Date(saved.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          ...withoutTemp,
        ];
      });
    } catch (err: any) {
      console.warn("Post failed → outbox", err);
      if (err.response?.status === 401) {
        const token = localStorage.getItem("token");
        if (!token || token === "null") {
          alert("Please sign in to post.");
          navigate("/signin");
        }
      } else {
        const outbox = getOutbox();
        outbox.push(tempPost);
        saveOutbox(outbox);
      }
    } finally {
      setIsModalOpen(false);
    }
  };

  // DELETE POST — SAFE
  const handleDeletePost = async (id: string) => {
    const currentUser = getCurrentUsername();
    const target = posts.find((p) => p.id === id);
    if (!target || target.username !== currentUser) {
      alert("You can only delete your own posts.");
      return;
    }

    setPosts((prev) => prev.filter((p) => p.id !== id));

    if (id.startsWith("tmp-")) {
      const outbox = getOutbox();
      saveOutbox(outbox.filter((p) => p.id !== id));
      return;
    }

    try {
      await axiosInstance.delete(`/api/feeds/${id}`);
    } catch (err: any) {
      if (err.response?.status === 401) {
        const token = localStorage.getItem("token");
        if (!token || token === "null") {
          alert("Session expired.");
          navigate("/signin");
        }
      }
    }
  };

  // LIKE / COMMENT — REDIRECT ONLY ON ACTION
  const handleToggleLike = async (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              likedByUser: !p.likedByUser,
              likes: p.likedByUser ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
    try {
      await axiosInstance.put(`/api/feeds/${id}/like`);
    } catch (err: any) {
      if (err.response?.status === 401) {
        const token = localStorage.getItem("token");
        if (!token || token === "null") {
          navigate("/signin");
        }
      }
    }
  };

  const handleAddComment = async (postId: string, text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      username: getCurrentUsername(),
      text,
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    try {
      await axiosInstance.post(`/api/replies/${postId}`, { text });
    } catch (err: any) {
      if (err.response?.status === 401) {
        const token = localStorage.getItem("token");
        if (!token || token === "null") {
          navigate("/signin");
        }
      }
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p
      )
    );
    try {
      await axiosInstance.delete(`/api/replies/${commentId}`);
    } catch (err: any) {
      if (err.response?.status === 401) {
        const token = localStorage.getItem("token");
        if (!token || token === "null") {
          navigate("/signin");
        }
      }
    }
  };

  // FILTER + PAGINATION
  const filteredPosts = posts
    .filter(
      (p) => selectedCategory === "All" || p.category === selectedCategory
    )
    .filter(
      (p) =>
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.anonymous_name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (p.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + POSTS_PER_PAGE);

  if (loading) return <p className={styles.emptyText}>Loading posts...</p>;

  return (
    <div className={styles.feedContainer}>
      <Header
        title="Safe Rant"
        subtitles="Express yourself freely"
        onAddPost={() => {
          if (!localStorage.getItem("token")) {
            alert("Please sign in to post.");
            navigate("/signin");
          } else {
            setIsModalOpen(true);
          }
        }}
      />

      {/* GUEST BANNER — SHOWS ONLY FOR GUESTS */}
      {(!localStorage.getItem("token") ||
        localStorage.getItem("token") === "null") &&
        showGuestBanner && (
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
{/* 
      {error && <p className={styles.errorText}>{error}</p>} */}

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
              showDelete={post.username === getCurrentUsername()}
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
