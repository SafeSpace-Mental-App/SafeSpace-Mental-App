
import React, { useState } from "react";
import styles from "./NewPostModal.module.css";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string, category: string) => void; // 🆕 added category
}

const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onPost,
}) => {
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("All"); // set category

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;
    onPost(content, category); // pass both
    setContent("");
    setCategory("All");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h3>Create a new post</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/*  Category Selector */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="All">All</option>
            <option value="Work"> Work</option>
            <option value="Rant">Rant</option>
            <option value="Family">Family</option>
            <option value="Anxiety">Anxiety</option>
            <option value="Selfcare">Selfcare</option>
          </select>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                onClose();
                setContent("");
                setCategory("All");
              }}
            >
              Cancel
            </button>
            <button type="submit" className={styles.postBtn}>
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPostModal;
