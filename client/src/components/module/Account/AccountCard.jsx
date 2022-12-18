import styles from "./AccountCard.module.css"
import { BoxImage } from "@components/common";

function AccountCard({imgSize = 260, img, header, name, id, email, contact}) {
    return(
        <div className={styles.container}>
            <div className={styles.header}>{header}</div>
            <div className={styles.content}>
                <BoxImage
                    src={img}
                    alt={`profile picture.`}
                    size={imgSize}
                    className={styles.img}
                />
                <div className={styles.righContent}>
                    <div className={styles.detail}>
                        <div className={styles.acountName}>
                            <h2 className={styles.name}>{name}</h2>
                        </div>
                        <div className={styles.idNum}>
                            <p className={styles.label}>ID number</p>
                            <h2 className={styles.data}>{id}</h2>
                        </div>
                        <div className={styles.email}>
                            <p className={styles.label}>Email address</p>
                            <h2 className={styles.data}>{email}</h2>
                        </div>
                        <div className={styles.contact}>
                            <p className={styles.label}>Contact Number</p>
                            <h2 className={styles.data}>{contact}</h2>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <button className={styles.accountBtn}>Edit Profile</button>
                        <button className={styles.accountBtn}>Change Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountCard;