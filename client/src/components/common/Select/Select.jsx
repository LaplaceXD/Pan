import { clsx } from "clsx";
import CreatableSelect from "react-select/creatable";

import Field from "../Field";
import styles from "./Select.module.css";

function Select({ label, id, error, value, options, ...props }) {
  return (
    <Field label={label} id={id} error={error}>
      <CreatableSelect
        id={id}
        classNames={{
          option: (state) => clsx(styles.option, state.isSelected && styles.isSelected),
          menu: () => styles.menu,
          control: () => styles.control,
          singleValue: () => styles.input,
        }}
        value={options ? options.find((option) => option.value === value) : ""}
        options={options}
        {...props}
      />
    </Field>
  );
}

export default Select;
