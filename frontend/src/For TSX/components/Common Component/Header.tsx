import React from "react";
import styles from "./Header.module.css";
import { FiPlus } from "react-icons/fi";

interface HeaderProps {
  title?: string;
  subtitles?: string;
  onAddPost?: () => void;
  className?: string
  
}                                                          

const Header: React.FC<HeaderProps> = ({ title = "Safe Rant", subtitles, onAddPost, className=''}) => {
  
  const headerClasses = `${styles.header} ${className}`.trim();
  return (
    <header className= {headerClasses}   >
      <div className={styles.titleSection}>
        <h1 className={styles.title}  >{title}</h1>
        <p className={styles.subtitle}>{subtitles}</p>
      </div>

      {/* Floating Add Post Button */}
      {onAddPost && (
        <button className={styles.floatingBtn} onClick={onAddPost}>
          <FiPlus size={22} />
        </button>
      )}
    </header>
  );
};

export default Header;
