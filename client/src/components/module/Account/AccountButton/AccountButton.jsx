import styles from "./AccountButton.module.css"

function AccountButton({ label, onClick, className }) {
    return (
        <button className={`${styles.button} ${className}`} onClick={onClick}>{label}</button>
    );
}

export default AccountButton;