import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import axiosInstance from "../../../../api/axiosInstance";
import type { Post } from "../../../For Types/posttype";

const PENDING_LIKES_KEY = "pendingLikes";
const OFFLINE_QUEUE_KEY = "offlineQueue";
const OUTBOX_KEY = "outboxPosts";

// Add this type
type HttpMethod = "get" | "post" | "put" | "delete";

export const useOfflineHandling = () => {
  const [pendingLikes, setPendingLikes] = useLocalStorage<Set<string>>(
    PENDING_LIKES_KEY,
    new Set()
  );

  // Use HttpMethod instead of string
  const [offlineQueue, setOfflineQueue] = useLocalStorage<
    { method: HttpMethod; url: string; data?: any }[]
  >(OFFLINE_QUEUE_KEY, []);

  const [outbox, setOutbox] = useLocalStorage<Post[]>(OUTBOX_KEY, []);

  const savePendingLike = useCallback(
    (id: string) => setPendingLikes((p) => new Set([...p, id])),
    [setPendingLikes] // fix here incase in future
  );

  const removePendingLike = useCallback(
    (id: string) =>
      setPendingLikes((p) => {
        const next = new Set(p);
        next.delete(id);
        return next;
      }),
    [setPendingLikes]
  );

  const saveOfflineAction = useCallback(
    (action: { method: HttpMethod; url: string; data?: any }) =>
      setOfflineQueue((q) => [...q, action]),
    [setOfflineQueue]
  );

  const processOfflineQueue = useCallback(async () => {
    if (!offlineQueue.length) return;

    const remaining: typeof offlineQueue = [];

    for (const action of offlineQueue) {
      try {
        if (action.data !== undefined) {
          await axiosInstance[action.method](action.url, action.data);
        } else {
          await axiosInstance[action.method](action.url);
        }
      } catch {
        remaining.push(action);
      }
    }

    setOfflineQueue(remaining);
  }, [offlineQueue, setOfflineQueue]);

  const syncOutbox = useCallback(
    async (setPosts: React.Dispatch<React.SetStateAction<Post[]>>) => {
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
          const realId = saved._id;

          setPosts((prev) => {
            const filtered = prev.filter((x) => x.id !== p.id);
            return [
              {
                ...saved,
                id: realId,
                anonymous_name:
                  saved.anonymous_name || p.anonymous_name || "Anonymous",
                likes:
                  (saved.likes?.length || 0) +
                  (pendingLikes.has(realId) ? 1 : 0),
                likedByUser: pendingLikes.has(realId),
                comments: (saved.replies || []).map((r: any) => ({
                  id: r._id,
                  username: r.anonymous_name || "Anonymous",
                  text: r.text,
                })),
                time: new Date(saved.createdAt).getTime(),
              },
              ...filtered,
            ];
          });

          if (pendingLikes.has(realId)) {
            removePendingLike(realId);
          }
        } catch (err: any) {
          if (err.response?.status === 401) break;
          remaining.push(p);
        }
      }
      setOutbox(remaining);
    },
    [outbox, pendingLikes, removePendingLike, setOutbox]
  );

  return {
    pendingLikes,
    savePendingLike,
    removePendingLike,
    saveOfflineAction,
    processOfflineQueue,
    outbox,
    setOutbox,
    syncOutbox,
  };
};
