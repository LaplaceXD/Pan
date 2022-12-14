import placeholderImg from "@assets/imgs/emp-img.jpg";
import { BoxImage } from "@components/common";
import { useAuth } from "@hooks/auth";

import styles from "./UserBanner.module.css";

function UserBanner() {
  const { user } = useAuth();

  const fullName = `${user.first_name} ${user.last_name}`;
  const capitalizedRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);

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
