import React from "react";
import PostCard from "./PostCard";
import styles from "./FeedList.module.css";

interface Post {
  id: number;
  username: string;
  content: string;
  time: string;
}

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
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default FeedList;
