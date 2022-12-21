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
            <button type="button" onClick={() => selectProps.onOptionEdit(props.value)}>
              <FaEdit size={20} />
            </button>
            <button type="button" onClick={() => selectProps.onOptionDelete(props.value)}>
              <BsTrash size={20} />
            </button>
          </>
        ) : null}
      </div>
    </components.Option>
  );
}

export default CategoryOption;
