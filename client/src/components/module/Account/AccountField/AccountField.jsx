import styles from "./AccountField.module.css";

function AccountField({ label, id, error, ...props }) {
    return (
        <div className={styles.container}>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
            <input className={styles.input} {...props} />
            {error ? <p className={styles.error}>{error}</p> : null}
        </div>
    );
}

export default AccountField;
