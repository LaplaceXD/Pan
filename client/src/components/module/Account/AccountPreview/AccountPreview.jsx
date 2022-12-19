import styles from "./AccountPreview.module.css";
import AccountButton from "../AccountButton";

function AccountPreview({ name, id, email, contact, leftBtn, rightBtn }) {
    return (
        <div>
            <div>
                <h1 className={styles.name}>{name}</h1>
                <div className={styles.contentLine}>
                    <p className={styles.label}>ID number</p>
                    <h2 className={styles.data}>{id}</h2>
                </div>
                <div className={styles.contentLine}>
                    <p className={styles.label}>Email Address</p>
                    <h2 className={styles.data}>{email}</h2>
                </div>
                <div className={styles.contentLine}>
                    <p className={styles.label}>Contact Number</p>
                    <h2 className={styles.data}>{contact}</h2>
                </div>
            </div>
            <div className={styles.footer}>
                <AccountButton label={leftBtn}/>
                <AccountButton label={rightBtn}/>
            </div>
        </div>
    );
}

export default AccountPreview;