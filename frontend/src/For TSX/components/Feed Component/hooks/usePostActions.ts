import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { useOfflineHandling } from "./useOfflineHandling";
import type { Post } from "../../../For Types/posttype";
import axiosInstance from "../../../../api/axiosInstance";
// import { useUser } from "../../../My Space/For Hooks/useUser";

export const usePostActions = (
  posts: Post[],
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
) => {
  // const { user } = useUser();
  const { currentUsername, handle401 } = useAuth();
  const {
    savePendingLike,
    removePendingLike,
    saveOfflineAction,
    outbox,
    setOutbox,
    pendingLikes,
  } = useOfflineHandling();
  const currentUserId =
    localStorage.getItem("userId") || localStorage.getItem("email") || "";

  //ADD POST
  const handleAddPost = useCallback(
    async (
      content: string,
      category: string,
      title?: string,
      visibility?: string
    ) => {
      const finalTitle = title?.trim()
        ? title
        : content.slice(0, 40) || "Untitled Post";
      const finalVisibility = visibility ?? "public";

      const tempId = `tmp-${Date.now()}`;

      const tempPost: Post = {
        id: tempId,
        title: finalTitle,
        content,
        createdAt: new Date().toISOString(),
        category,
        username: currentUsername,
        anonymous_name:
          visibility === "anonymous" ? currentUsername : undefined,
        likes: 0,
        likedByUser: false,
        comments: [],
        visibility: finalVisibility,
      };

      setPosts((p) => [tempPost, ...p]);

      try {
        console.log("📤 Sending post to backend", {
          title: finalTitle,
          content,
          category,
          visibility: finalVisibility,
          username: currentUsername,
        });
        const res = await axiosInstance.post("/api/feeds/create", {
          title: finalTitle,
          content,
          category,
          visibility: finalVisibility,
          username: currentUsername,
        });
        console.log("📥 Backend response:", res.data);

        const saved = res.data.feed || res.data;
        const realId = saved._id;

        setPosts((prev) => {
          const withoutTemp = prev.filter((p) => p.id !== tempId);
          return [
            {
              ...saved,
              id: realId,
              anonymous_name: saved.anonymous_name || currentUsername,
              createdAt: saved.createdAt,
              // avatar: user.avatar,

              likes:
                (Array.isArray(saved.likes)
                  ? saved.likes.length
                  : saved.likes || 0) + (pendingLikes.has(realId) ? 1 : 0),

              likedByUser:
                pendingLikes.has(realId) ||
                (Array.isArray(saved.likes)
                  ? saved.likes.includes(currentUserId)
                  : false),

              comments: (saved.replies || []).map((r: any) => ({
                id: r._id,
                username: r.anonymous_name || "Anonymous",
                text: r.text,
              })),

              // time: new Date(saved.createdAt).getTime(),
            },
            ...withoutTemp,
          ];
        });

        if (pendingLikes.has(realId)) {
          removePendingLike(realId);
        }
      } catch (err: any) {
        console.error(
          "❌ Create post failed:",
          err.response?.data || err.message
        );
        if (!handle401(err, "Please sign in to post.")) {
          setOutbox((prev) => [...prev, tempPost]);
        }
      }
    },
    [
      currentUsername,

      setPosts,
      pendingLikes,
      currentUserId,
      removePendingLike,
      handle401,
      setOutbox,
    ]
  );

  // DELETE POST
  const handleDeletePost = useCallback(
    async (id: string) => {
      const target = posts.find((p) => p.id === id);
      const isOwner =
        target?.anonymous_name === currentUsername ||
        target?.username === currentUsername ||
        target?.username === localStorage.getItem("email");

      if (!target || !isOwner)
        return alert("You can only delete your own posts.");

      setPosts((p) => p.filter((x) => x.id !== id));
      if (id.startsWith("tmp-")) {
        setOutbox((prev) => prev.filter((p) => p.id !== id));
        return;
      }

      try {
        await axiosInstance.delete(`/api/feeds/${id}`);
      } catch (err: any) {
        handle401(err, "Session expired.");
      }
    },
    [posts, currentUsername, handle401, outbox]
  );

  //
  const handleToggleLike = useCallback(
    async (id: string) => {
      const wasLiked = posts.find((p) => p.id === id)?.likedByUser ?? false;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                likedByUser: !wasLiked,
                likes: wasLiked ? Math.max(0, p.likes - 1) : (p.likes || 0) + 1,
              }
            : p
        )
      );

      if (!wasLiked) savePendingLike(id);
      else removePendingLike(id);

      try {
        await axiosInstance.put(`/api/feeds/${id}/like`);
        removePendingLike(id);
      } catch (err: any) {
        saveOfflineAction({
          method: "put",
          url: `/api/feeds/${id}/like`,
          data: null,
        });
        handle401(err);
      }
    },
    [
      posts,
      setPosts,
      savePendingLike,
      removePendingLike,
      saveOfflineAction,
      handle401,
    ]
  );

  const handleAddComment = useCallback(
    async (postId: string, text: string) => {
      const newComment = {
        id: `c-${Date.now()}`,
        username: currentUsername,
        text,
      };
      setPosts((p) =>
        p.map((x) =>
          x.id === postId ? { ...x, comments: [...x.comments, newComment] } : x
        )
      );

      try {
        await axiosInstance.post(`/api/replies/${postId}`, { text });
      } catch (err: any) {
        saveOfflineAction({
          method: "post",
          url: `/api/replies/${postId}`,
          data: { text },
        });
        handle401(err);
      }
    },
    [currentUsername, setPosts, saveOfflineAction, handle401]
  );

  const handleDeleteComment = useCallback(
    async (postId: string, commentId: string) => {
      setPosts((p) =>
        p.map((x) =>
          x.id === postId
            ? { ...x, comments: x.comments.filter((c) => c.id !== commentId) }
            : x
        )
      );
      try {
        await axiosInstance.delete(`/api/replies/${commentId}`);
      } catch (err: any) {
        handle401(err);
      }
    },
    [handle401, setPosts]
  );

  return {
    handleAddPost,
    handleDeletePost,
    handleToggleLike,
    handleAddComment,
    handleDeleteComment,
  };
};
