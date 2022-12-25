import { clsx } from "clsx";
import { cloneElement } from "react";

import Empty from "../Empty";
import Loader from "../Loader";
import styles from "./Grid.module.css";

function Grid({ items, itemKey, RenderComponent, className, emptyLabel = "", isLoading = false }) {
  if (isLoading) return <Loader fill className={className} />;
  if (items?.length === 0) return <Empty label={emptyLabel} className={className} />;

  return (
    <div className={clsx(styles.grid, className)}>
      {items?.map((item) =>
        RenderComponent ? cloneElement(RenderComponent(item), { key: itemKey(item) }) : null
      ) ?? null}
    </div>
  );
}

export default Grid;
