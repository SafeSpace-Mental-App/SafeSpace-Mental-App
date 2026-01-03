import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { FiSmile } from "react-icons/fi";
import { RiQuillPenLine } from "react-icons/ri";
import { FaHome } from "react-icons/fa";

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
            <FaHome size={24} />
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
            <RiQuillPenLine size={24} />
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
          <span className={styles.smiley}>
            {" "}
            <FiSmile size={24} />{" "}
          </span>
          Mood Log
        </div>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active} ` : styles.link
        }
        to="/my-space"
      >
        <div className={styles.iconVerticalSpecial}>
          <span className={styles.smiley}>
            {/* <FiUser size={24} /> */}

            <img
              src="/images/Mask2.png"
              alt="Mask"
              sizes="24"
              className={styles.smiley2}
            />
          </span>
          My space
        </div>
      </NavLink>
    </nav>
  );
};

export default Navbar;
