import { clsx } from "clsx";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";

import Field from "../Field";
import styles from "./Select.module.css";

function Select({ label, id, error, value, options, isCreatable = false, ...props }) {
  const Component = isCreatable ? CreatableSelect : ReactSelect;

  return (
    <Field label={label} id={id} error={error}>
      <Component
        id={id}
        classNames={{
          option: (state) => clsx(styles.option, state.isSelected && styles.isSelected),
          menu: () => styles.menu,
          control: () => styles.control,
          singleValue: (state) => clsx(styles.input, state.isDisabled && styles.isDisabled),
          input: () => styles.input,
        }}
        value={options ? options.find((option) => option.value === value) : ""}
        options={options}
        {...props}
      />
    </Field>
  );
}

export default Select;
