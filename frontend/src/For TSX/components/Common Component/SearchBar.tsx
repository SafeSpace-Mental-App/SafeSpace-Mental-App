import React from "react";
import styles from "./SearchBar.module.css";
import { FiSearch } from "react-icons/fi";

const SearchBar: React.FC = () => {
  return (
    <div className={styles.searchBar}>
      <FiSearch className={styles.icon} size={18} />
      <input
        type="text"
        placeholder="Search posts or topics ..."
        className={styles.inPut}
      />
    </div>
  );
};

export default SearchBar;
