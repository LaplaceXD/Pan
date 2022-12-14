import { clsx } from "clsx";
import { cloneElement } from "react";
import styles from "./List.module.css";

function List({ items, itemKey, RenderComponent, className, column = false }) {
  return (
    <ul className={clsx(styles.list, column && styles.col, className)}>
      {items?.map((item) =>
        RenderComponent ? cloneElement(RenderComponent(item), { key: itemKey(item) }) : null
      ) ?? null}
    </ul>
  );
}

export default List;
