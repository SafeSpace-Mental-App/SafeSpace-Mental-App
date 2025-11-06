import React from "react";
import styles from "./CategoryTabs.module.css";

interface CategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = ["All", "Work", "Rant", "Family", 'Anxiety', 'Selfcare'];

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className={styles.tabsContainer}>
      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.tabButton} ${
            selectedCategory === category ? styles.active : ""
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
