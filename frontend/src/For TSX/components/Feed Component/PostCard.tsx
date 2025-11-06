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
  onDeleteComment?: (postId: number, commentId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onDelete,
  onToggleLike,
  onAddComment,
  onDeleteComment,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeCommentMenu, setActiveCommentMenu] = useState<number | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setActiveCommentMenu(null);
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

  const handleDeleteComment = (commentId: number) => {
    onDeleteComment?.(post.id!, commentId);
    setActiveCommentMenu(null);
  };

  return (
    <div className={styles.card}>
      {/* Header */}
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

      {/* Content */}
      <p className={styles.content}>{post.content}</p>
      <span className={styles.tag}>{post.category}</span>

      {/* Actions */}
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

      {/* Comments */}
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
              <div key={c.id} className={styles.commentItem}>
                <p className={styles.commentText}>💬 {c.text}</p>

                <div className={styles.commentMenuWrapper}>
                  <button
                    className={styles.commentMoreBtn}
                    onClick={() =>
                      setActiveCommentMenu(
                        activeCommentMenu === c.id ? null : c.id
                      )
                    }
                  >
                    <FiMoreHorizontal size={14} />
                  </button>

                  {activeCommentMenu === c.id && (
                    <div className={styles.commentDropdown}>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        <FiTrash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
