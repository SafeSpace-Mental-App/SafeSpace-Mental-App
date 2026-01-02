import React, { useEffect, useState } from "react";
import styles from "../Journal Component/newJournalModal.module.css";
import { AiOutlineClose } from "react-icons/ai";
import type { journalPost } from "../../For Types/posttype";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string, title?: string) => void;
  journalContent: journalPost;
}

const EditPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onSave,
  journalContent,
}) => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  // 🔄 Sync modal state when post changes
  useEffect(() => {
    if (journalContent) {
      setContent(journalContent.content);
      setTitle(journalContent.title ?? "");
    }
  }, [journalContent]);

  // ✅ HANDLE SUBMIT
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) return;

    onSave(content, title);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.journalParentContainer}>
        <div className={styles.journalContainer}>
          <div className={styles.closeandDraft}>
            <button
              type="button"
              onClick={onClose}
              className={styles.closebutton}
            >
              <AiOutlineClose />
            </button>
            <p className={styles.draft}>Draft</p>
          </div>

          {/* Title Input */}
          <input
            type="text"
            placeholder="Enter a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.titleInput}
          />

          {/* Content Input */}
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to share?"
          />

          <div className={styles.saveContainer}>
            <button type="submit" className={styles.save}>
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditPostModal;
