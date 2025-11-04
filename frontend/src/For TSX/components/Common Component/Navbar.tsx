import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active} ` : styles.link
        }
        to="/feed"
      >
        Feed
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active} ` : styles.link
        }
        to="/journal"
      >
        Journal
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active} ` : styles.link
        }
        to="/mood"
      >
        Mood Log
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active} ` : styles.link
        }
        to="/support"
      >
        {" "}
        Support
      </NavLink>
    </nav>
  );
};

export default Navbar;
