import React, { useState, useEffect, useRef } from "react";
import styles from "./PostCard.module.css";
import {
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiTrash2,
} from "react-icons/fi";
import type { Post } from "../../For Types/posttype";

interface PostCardProps {
  post: Post;
  showDelete?: boolean; // ✅ ensure we accept showDelete from parent
  onDelete?: (id: string) => void;
  onToggleLike?: (id: string) => void;
  onAddComment?: (postId: string, text: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  showDelete = false, // ✅ default false if not provided
  onDelete,
  onToggleLike,
  onAddComment,
  onDeleteComment,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeCommentMenu, setActiveCommentMenu] = useState<string | null>(
    null
  );
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const commentMenuRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const postId = post.id;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      let shouldClose = true;
      commentMenuRefs.current.forEach((ref) => {
        if (ref && ref.contains(event.target as Node)) shouldClose = false;
      });
      if (shouldClose) setActiveCommentMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment?.(postId, commentText);
    setCommentText("");
  };

  const handleDeleteComment = (commentId: string) => {
    onDeleteComment?.(postId, commentId);
    setActiveCommentMenu(null);
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

          {/* ✅ Only show delete option if it's the user's own post */}
          {showMenu && showDelete && (
            <div className={`${styles.menuDropdown} ${styles.fadeIn}`}>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  onDelete?.(postId);
                  setShowMenu(false);
                }}
              >
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {post.title && <h4 className={styles.postTitle}>{post.title}</h4>}
      <p className={styles.content}>{post.content}</p>
      <span className={styles.tag}>{post.category}</span>

      {post.visibility && (
        <span className={styles.visibilityTag}>
          {post.visibility === "public" ? "⚪️ Public" : "🔒 Private"}
        </span>
      )}

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${
            post.likedByUser ? styles.liked : ""
          }`}
          onClick={() => onToggleLike?.(postId)}
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

      {showComments && (
        <div className={styles.commentSection}>
          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className={styles.commentInput}
              rows={2}
            />
            <button type="submit">Send</button>
          </form>

          <div className={styles.commentList}>
            {post.comments?.map((c) => (
              <div key={c.id} className={styles.commentItem}>
                <p className={styles.commentText}>{c.text}</p>

                <div
                  className={styles.commentMenuWrapper}
                  ref={(el) => {
                    if (el) commentMenuRefs.current.set(c.id, el);
                    else commentMenuRefs.current.delete(c.id);
                  }}
                >
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
                    <div
                      className={`${styles.commentDropdown} ${styles.fadeIn}`}
                    >
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
