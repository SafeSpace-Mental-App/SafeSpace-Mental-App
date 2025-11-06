import React, { useState } from "react";
import styles from "./NewPostModal.module.css";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string) => void;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose, onPost }) => {
  const [content, setContent] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;
    onPost(content);
    setContent("");
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
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
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
