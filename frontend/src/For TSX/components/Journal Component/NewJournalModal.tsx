import React from "react";
import { useState } from "react";
import styles from "../Journal Component/newJournalModal.module.css";
import { AiOutlineClose } from "react-icons/ai";
interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string, title?: string) => void;
}

const NewJournalModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onPost,
}) => {
  const [content, setContent] = useState<string>("");
   const [title, setTitle] = useState<string>(""); 

  //  HANDLE SUBMIT
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim) return;
    onPost(content, title);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles.journalParentContainer}>
          <div className={styles.journalContainer}>
            <div className={styles.closeandDraft}>
              <button
                type="button"
                onClick={onClose}
                className={styles.closebutton}
              >
                {/* <FaTimes /> */}
                <AiOutlineClose />
              </button>
              <p className={styles.draft}>Draft</p>
            </div>
            {/*  Title Input */}
            <input
              type="text"
              placeholder="Enter a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.titleInput}
            />
            <textarea
              className={styles.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to share?"
            ></textarea>
            <div className={styles.saveContainer}>
              <button type="submit" className={styles.save}>
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default NewJournalModal;
