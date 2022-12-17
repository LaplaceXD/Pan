import { clsx } from "clsx";
import styles from "./Header.module.css";

function Header({ title, children, className }) {
  return (
    <header className={clsx(styles.header, className)}>
      {title ? <h1 className={styles.title}>{title}</h1> : null}
      {children}
    </header>
  );
}

export default Header;
