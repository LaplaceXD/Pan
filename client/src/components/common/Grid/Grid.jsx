import { clsx } from "clsx";
import { cloneElement } from "react";
import styles from "./Grid.module.css";

function Grid({ items, itemKey, RenderComponent, className }) {
  return (
    <div className={clsx(styles.grid, className)}>
      {items?.map((item) =>
        RenderComponent ? cloneElement(RenderComponent(item), { key: itemKey(item) }) : null
      ) ?? null}
    </div>
  );
}

export default Grid;
