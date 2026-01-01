import React, { useState } from "react";
import styles from "./NewPostModal.module.css";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (
    content: string,
    category: string,
    title?: string,
    visibility?: string
  ) => void; // ✅ added title & visibility (optional)
}

const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onPost,
}) => {
  const [title, setTitle] = useState<string>(""); //  new: title
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const [visibility, setVisibility] = useState<string>("public"); //  new: visibility

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;
    onPost(content, category, title, visibility); //  pass new fields
    setTitle("");
    setContent("");
    setCategory("All");
    setVisibility("public");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h3>Create a new post</h3>
        <form onSubmit={handleSubmit}>
          {/*  Title Input */}
          <input
            type="text"
            placeholder="Enter a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.titleInput}
          />

          {/* Existing content textarea */}
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Category Selector */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="All">All</option>
            <option value="Work">Work</option>
            <option value="Rant">Rant</option>
            <option value="Family">Family</option>
            <option value="Anxiety">Anxiety</option>
            <option value="Selfcare">Selfcare</option>
          </select>

          {/* ✅ Visibility Selector */}
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className={styles.visibilitySelect}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                onClose();
                setTitle("");
                setContent("");
                setCategory("All");
                setVisibility("public");
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
