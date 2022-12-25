import { clsx } from "clsx";
import { cloneElement } from "react";

import Empty from "../Empty";
import Loader from "../Loader";
import styles from "./List.module.css";

function List({
  items,
  itemKey,
  RenderComponent,
  className,
  isLoading = false,
  emptyLabel = "",
  column = false,
}) {
  if (isLoading) return <Loader fill className={className} />;
  if (items?.length === 0) return <Empty label={emptyLabel} className={className} />;

  return (
    <ul className={clsx(styles.list, column && styles.col, className)}>
      {items?.map((item) =>
        RenderComponent ? cloneElement(RenderComponent(item), { key: itemKey(item) }) : null
      ) ?? null}
    </ul>
  );
}

export default List;
