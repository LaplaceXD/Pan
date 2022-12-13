import { BoxImage } from "@components/common";
import styles from "./User.module.css";

function User({ role, name, img }) {
  return (
    <div className={styles.container}>
      <BoxImage src={img} alt={`${name}'s profile picture.`} size={72} className={styles.img} />
      <div className={styles.details}>
        <p className={styles.role}>{role}</p>
        <p className={styles.name}>{name}</p>
      </div>
    </div>
  );
}

export default User;
