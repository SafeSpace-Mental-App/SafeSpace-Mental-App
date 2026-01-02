import { useEffect, useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useOfflineHandling } from "./useOfflineHandling";
import axiosInstance from "../../../../api/axiosInstance";
import type { Post } from "../../../For Types/posttype";

const LOCAL_KEY = "userPosts";

const dummyPosts: Post[] = [
  /* your dummy post objects */
];

export const useFeed = () => {
  const [posts, setPosts] = useLocalStorage<Post[]>(LOCAL_KEY, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { pendingLikes, processOfflineQueue, syncOutbox } =
    useOfflineHandling();

  // --- Sync avatar for own posts whenever currentUser changes ---

  // --- Fetch posts from backend ---
  const fetchFeeds = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/feeds");
      const currentUserId =
        localStorage.getItem("userId") || localStorage.getItem("email");

      if (!res.data?.feeds) return;

      const serverPosts: Post[] = res.data.feeds.map((feed: any) => {
        const serverLiked = feed.likes?.includes(currentUserId);
        const isPending = pendingLikes.has(feed._id);

        return {
          id: feed._id,
          title: feed.title,
          content: feed.content,
          category: feed.category,
          likes: isPending
            ? (feed.likes?.length || 0) + 1
            : feed.likes?.length || 0,
          likedByUser: isPending || serverLiked,
          comments: (feed.replies || []).map((r: any) => ({
            id: r._id,
            username: r.anonymous_name || "Anonymous",
            text: r.text,
          })),
          visibility: feed.visibility,
          createdAt: feed.createdAt,
          userId: feed.user?.id ?? feed.userId ?? "unknown",
          username: feed.user?.username ?? feed.anonymous_name ?? "Anonymous",
          // user: feed.user,
          user: feed.user
            ? {
                id: feed.user.id,
                avatar: feed.user.avatar ?? "/images/anon1.png",
              }
            : {
                id: "unknown",
                avatar: "/images/anon1.png",
              },
        };
      });

      setPosts((prev) => {
        const tempPosts = prev.filter((p) => p.id.startsWith("tmp-"));
        const resolvedTemps = tempPosts.filter(
          (tmp) =>
            !serverPosts.some(
              (sp) =>
                sp.title === tmp.title &&
                sp.content === tmp.content &&
                sp.category === tmp.category
            )
        );
        return [...resolvedTemps, ...serverPosts];
      });
    } catch {
      setError("Offline mode");
    }
  }, [pendingLikes, setPosts]);

  // --- Initial load ---
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_KEY);
    if (cached) {
      try {
        setPosts(JSON.parse(cached));
      } catch {
        //
      }
    }

    const init = async () => {
      try {
        await fetchFeeds();
      } catch {
        setError("Offline mode");
        if (!cached) setPosts(dummyPosts);
      } finally {
        setLoading(false);
        await syncOutbox(setPosts);
      }
    };

    init();
    processOfflineQueue();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Sync to localStorage ---
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(posts));
  }, [posts]);

  return { posts, setPosts, loading, error };
};
