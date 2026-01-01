// src/hooks/useSyncedLikes.ts
import { useEffect } from "react";
import { useOfflineHandling } from "./useOfflineHandling";
import type { Post } from "../../../For Types/posttype";

export const useSyncedLikes = (
  posts: Post[],
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
) => {
  const { pendingLikes } = useOfflineHandling();

  useEffect(() => {
    setPosts((prev) =>
      prev.map((post) => {
        if (pendingLikes.has(post.id)) {
          return {
            ...post,
            likedByUser: true,
            likes: (post.likes || 0) + 1,
          };
        }
        return post;
      })
    );
  }, [posts.length, pendingLikes.size]);
};