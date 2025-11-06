import React, { useState } from "react";
import styles from "./CategoryTabs.module.css";

const categories = ["All", "Work", "Rant", "Family", "Anxiety", "Self-care"];

const CategoryTabs: React.FC = () => {
  const [active, setActive] = useState("All");

  return (
    <div className={styles.tabsContainer}>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`${styles.tabButton} ${
            active === cat ? styles.active : ""
          }`}
          onClick={() => setActive(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
