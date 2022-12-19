import styles from "./AccountButton.module.css"

function AccountButton({ label }) {
    return (
        <button className={styles.button}>{label}</button>
    );
}

export default AccountButton;