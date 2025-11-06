import React from "react";
import styles from "./PostCard.module.css";
import { FiHeart, FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";

interface Post {
  username?: string;
  time?: string;
  content?: string;
  category?: string;
  likes?: number;
  comments?: number;
}

interface PostCardProps {
  post: Post;
}
const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.username}>{post.username}</h3>
          <p className={styles.time}>{post.time}</p>
        </div>
        <button className={styles.moreBtn}>
          <FiMoreHorizontal size={18} />
        </button>
      </div>

      <p className={styles.content}>{post.content}</p>

      <span className={styles.tag}>{post.category}</span>

      <div className={styles.actions}>
        <button className={styles.actionBtn}>
          <FiHeart size={18} /> <span>{post.likes}</span>
        </button>
        <button className={styles.actionBtn}>
          <FiMessageCircle size={18} /> <span>{post.comments}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
