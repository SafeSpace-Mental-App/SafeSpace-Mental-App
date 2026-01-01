import React from "react";
import styles from "./SearchBar.module.css";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`${styles.searchBar} ${className}`}>
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
