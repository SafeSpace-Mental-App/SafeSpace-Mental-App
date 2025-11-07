import React from "react";
import styles from "./SearchBar.module.css";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className={styles.searchBar}>
      <FiSearch className={styles.icon} size={18} />
      <input
        type="text"
        placeholder="Search posts or topics..."
        className={styles.inPut}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
