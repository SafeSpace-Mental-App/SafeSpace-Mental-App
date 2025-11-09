import React from "react";
import PostCard from "./PostCard";
import styles from "./FeedList.module.css";
import type { Post } from "../../For Types/posttype";


interface FeedListProps {
  posts: Post[];
}

const FeedList: React.FC<FeedListProps> = ({ posts }) => {
  if (!posts.length) {
    return (
      <p className={styles.emptyText}>
        No posts yet. Be the first to share something!
      </p>
    );
  }

  return (
    <div className={styles.feedList}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={{
            ...post,
            category: post.category || "General",
            likes: typeof post.likes === "number" ? post.likes : 0,
            comments:
              Array.isArray(post.comments) &&
              post.comments.every((c) => typeof c === "object")
                ? post.comments
                : [],
          }}
        />
      ))}
    </div>
  );
};

export default FeedList;
