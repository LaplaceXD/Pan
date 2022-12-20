import styles from "./AccountField.module.css";

function AccountField({ className, label, id, error, ...props }) {
    return (
        <div className={`${styles.container} ${className}`}>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
            <input className={styles.input} {...props} />
            {error ? <p className={styles.error}>{error}</p> : null}
        </div>
    );
}

export default AccountField;
