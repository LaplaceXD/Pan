import { clsx } from "clsx";
import { FaSearch } from "react-icons/fa";

import styles from "./SearchBar.module.css";

function SearchBar({ className, onSearch, value }) {
  return (
    <div className={clsx(styles.container, className)}>
      <FaSearch className={styles.icon} />
      <input type="text" onChange={onSearch} value={value} className={styles.searchInput} />
    </div>
  );
}

export default SearchBar;
