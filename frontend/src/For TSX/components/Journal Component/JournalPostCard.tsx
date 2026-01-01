import type React from "react";
import styles from "../Journal Component/JournalPostCard.module.css";
import type { journalPost } from "../../For Types/posttype";
import { useState, useEffect } from "react";
import { FiTrash, FiEdit } from "react-icons/fi";

interface journalCardProp {
  contents: journalPost;
  onDelete?: (id: string) => void;
  onOpenEditModal?: () => void;
}

const JournalPostCard: React.FC<journalCardProp> = ({
  contents,
  onDelete,
  // onOpenModal,
  onOpenEditModal,
}) => {
  // useEffect(() => {
  //   const handleclick = (e: MouseEvent) => {
  //     if (menuRef.current && !menuRef.current.contains(e.target as Node))
  //       showDeleteMenu(false);
  //   };
  //   document.addEventListener("mousedown", handleclick);
  //   return () => document.removeEventListener("mousedown", handleclick);
  // }, []);
  // const [deleteMenu, showDeleteMenu] = useState(false);

  // const menuRef = useRef<HTMLDivElement>(null);
  const journalID = contents.id;

  const [, setNow] = useState(Date.now());

  // For TIMER
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000); // every 1 minute

    return () => clearInterval(interval);
  }, []);

  //TIME FORMAT
  const formatRelativeTime = (timestamp: number): string => {
    // if (typeof timestamp !== "number") return "";
    if (!timestamp || isNaN(timestamp)) return "";

    const date = new Date(timestamp);

    return date.toLocaleString("en-US", {
      month: "short", // Nov
      day: "numeric", // 15
      hour: "numeric", // 8
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <div className={styles.allContainer}>
        <div className={styles.card}>
          <div className={styles.moreAndTime}>
            <p className={styles.time}>{formatRelativeTime(contents.time)}</p>

            <div className={styles.moreButtonContainer}>
              <button
                className={styles.moreButtonDelete}
                onClick={() => {
                  onDelete?.(journalID);
                  // showDeleteMenu(false);
                }}
              >
                <FiTrash /> Delete
              </button>
              <button
                className={styles.moreButtonEdit}
                onClick={() => {
                  onOpenEditModal?.();
                }}
              >
                <FiEdit /> Edit
              </button>
            </div>
          </div>

          <p className={styles.title}> {contents.title}</p>
          <p className={styles.content}>{contents.content}</p>
        </div>
      </div>
    </>
  );
};

export default JournalPostCard;
