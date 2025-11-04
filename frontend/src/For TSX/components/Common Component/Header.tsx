import { FaArrowLeft, FaEllipsisH } from "react-icons/fa";
import styles from "./Header.module.css";

interface HeaderProp {
  title: string;
  onBack?: () => void;

}
const Header = ({ title, onBack }: HeaderProp) => {
  return (
    <>
      <header className={styles.header}>
        <button className={styles.iconBtn} onClick={onBack}>
          <FaArrowLeft className={styles.icon} />
        </button>
        <h2 className={styles.title}>{title}</h2>
        <FaEllipsisH className={styles.icon} />
      </header>
    </>
  );
};

export default Header;
