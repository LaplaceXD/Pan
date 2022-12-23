import { BsTrash } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";

import { components } from "react-select";
import styles from "./CategoryOption.module.css";

function CategoryOption({ children, selectProps: { selectProps }, ...props }) {
  return (
    <components.Option {...props}>
      <div className={styles.container}>
        <p>{children}</p>
        {selectProps.categories.some(({ category_id }) => category_id === props.value) ? (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                selectProps.onOptionEdit(props.data);
              }}
            >
              <FaEdit size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                selectProps.onOptionDelete(props.data);
              }}
            >
              <BsTrash size={20} />
            </button>
          </>
        ) : null}
      </div>
    </components.Option>
  );
}

export default CategoryOption;
