import React, { useCallback } from "react";
import type { journalPost } from "../../../For Types/posttype";
import axiosInstance from "../../../../api/axiosInstance";

const useJournalPostAction = (
  posts: journalPost[],
  setPosts: React.Dispatch<React.SetStateAction<journalPost[]>>
) => {
  const handleAddPost = useCallback(
    async (content: string, title?: string) => {
      const finalTitle = title?.trim()
        ? title
        : content.slice(0, 40) || "Untitled Post";

      // TEMP
      const tempId = `temp-${Date.now()}`;
      const tempPost: journalPost = {
        id: tempId,
        content,
        time: Date.now(),
        title: finalTitle,
      };

      setPosts((prev) => [tempPost, ...prev]);

      // REAL
      try {
        const res = await axiosInstance.post("/api/journals/create", {
          content,
          title: finalTitle,
        });
        const saved = res.data;
        const realId = saved._id;

        setPosts((x) => {
          const withoutTemp = x.filter((prev) => prev.id !== tempId);
          return [
            {
              ...saved,
              id: realId,
              time: new Date(saved.createdAt).getTime(),
            },
            ...withoutTemp,
          ];
        });
      } catch {
        //
      }
    },

    [setPosts]
  );

  // DELETE POST
  const handleDeletePost = useCallback(
    async (id: string) => {
      posts.find((p) => p.id === id);
      setPosts((p) => p.filter((x) => x.id !== id));
      // if (id.startsWith("tmp-")) {
      //   setOutbox((prev) => prev.filter((p) => p.id !== id));
      //   return;
      // }
      try {
        await axiosInstance.delete(`/api/feeds/${id}`);
      } catch {
        //
      }
    },
    [setPosts]
  );

  const handleSaveEditPost = useCallback(
  async (id: string, content: string, title?: string) => {
    const finalTitle = title?.trim()
      ? title
      : content.slice(0, 40) || "Untitled Post";

    // 1️⃣ Optimistic UI update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              content,
              title: finalTitle,
            }
          : p
      )
    );

    // 2️⃣ Persist to server
    try {
      await axiosInstance.put(`/api/journals/${id}`, {
        content,
        title: finalTitle,
      });
    } catch (err) {
      console.error("Edit failed, consider rollback", err);
      // Optional: rollback logic here
    }
  },
  [setPosts]
);


  return { handleAddPost, handleDeletePost, handleSaveEditPost };
};

export default useJournalPostAction;
