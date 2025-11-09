import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { FiHome, FiBook, FiUser } from "react-icons/fi";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active} ` : styles.link
        }
        to="/feed"
      >
        <div className={styles.iconVertical}>
          <span className={styles.smiley}>
            <FiHome size={24}  />
          </span>
          Feed
        </div>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active} ` : styles.link
        }
        to="/journal"
      >
        <div className={styles.iconVertical}>
          <span className={styles.smiley}>
            <FiBook size={24}  />
          </span>
          Journal
        </div>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active} ` : styles.link
        }
        to="/mood"
      >
        <div className={styles.iconVertical}>
          <span className={styles.smiley}>☺</span>
          Mood Log
        </div>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active} ` : styles.link
        }
        to="/myspace"
      >
        <div className={styles.iconVertical}>
          <span className={styles.smiley}>
            <FiUser size={24} />
          </span>
          My space
        </div>
      </NavLink>
    </nav>
  );
};

export default Navbar;
