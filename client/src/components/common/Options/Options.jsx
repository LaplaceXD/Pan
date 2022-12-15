import { clsx } from "clsx";

import styles from "./Options.module.css";

function Options({ options, onChange, value: selected, className }) {
  return (
    <ul className={clsx(styles.container, className)}>
      {options.map(({ label, value }) => (
        <li key={value}>
          <button
            className={clsx(styles.optionBtn, value === selected && styles.isSelected)}
            onClick={() => onChange(value)}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default Options;
