import placeholderImg from "@assets/imgs/emp-img.jpg";
import { BoxImage } from "@components/common";
import { useAuth } from "@hooks/Auth";

import styles from "./UserBanner.module.css";

function UserBanner() {
  const [{ first_name, last_name, role }] = useAuth();

  const fullName = `${first_name} ${last_name}`;
  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className={styles.container}>
      <BoxImage
        src={placeholderImg}
        alt={`${fullName}'s profile picture.`}
        size={72}
        className={styles.img}
      />
      <div className={styles.details}>
        <p className={styles.role}>{capitalizedRole}</p>
        <p className={styles.name}>{fullName}</p>
      </div>
    </div>
  );
}

export default UserBanner;
