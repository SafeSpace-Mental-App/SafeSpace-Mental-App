import React, { useState, useEffect, useRef } from "react";
import styles from "./PostCard.module.css";
import {
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiTrash2,
} from "react-icons/fi";

interface Comment {
  id: number;
  text: string;
}

interface Post {
  id?: number;
  username?: string;
  time?: string;
  content?: string;
  category?: string;
  likes?: number;
  comments?: Comment[];
}

interface PostCardProps {
  post: Post;
  onDelete?: (id: number) => void;
  onToggleLike?: (id: number) => void;
  onAddComment?: (postId: number, text: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onDelete,
  onToggleLike,
  onAddComment,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment?.(post.id!, commentText);
    setCommentText("");
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.username}>{post.username}</h3>
          <p className={styles.time}>{post.time}</p>
        </div>

        <div ref={menuRef} className={styles.menuWrapper}>
          <button
            className={styles.moreBtn}
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <FiMoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div className={styles.menuDropdown}>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  onDelete?.(post.id!);
                  setShowMenu(false);
                }}
              >
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className={styles.content}>{post.content}</p>
      <span className={styles.tag}>{post.category}</span>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${post.likes ? styles.liked : ""}`}
          onClick={() => onToggleLike?.(post.id!)}
        >
          <FiHeart size={18} /> <span>{post.likes}</span>
        </button>
        <button
          className={styles.actionBtn}
          onClick={() => setShowComments((prev) => !prev)}
        >
          <FiMessageCircle size={18} />{" "}
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* ✅ Comment section */}
      {showComments && (
        <div className={styles.commentSection}>
          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className={styles.commentInput}
              rows={1}
            />
            <button type="submit">Send</button>
          </form>

          <div className={styles.commentList}>
            {post.comments?.map((c) => (
              <p key={c.id} className={styles.comment}>
                💬 {c.text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
