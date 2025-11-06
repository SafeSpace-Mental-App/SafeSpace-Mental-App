import React from "react";
import styles from "./Header.module.css";
import { FiPlus } from "react-icons/fi";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Safe Rant</h1>
        <p className={styles.subtitle}>Express yourself freely</p>
      </div>
   
    </header>
  );
};

// interface HeaderProps {
//   title?: string;
//   onAddPost?: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ title, onAddPost }) => {
//   return (
//     <header className={styles.header}>
//       <h2>{title}</h2>
//       <button className={styles.floatingBtn} onClick={onAddPost}>+</button>
//     </header>
//   );
// };


export default Header;
