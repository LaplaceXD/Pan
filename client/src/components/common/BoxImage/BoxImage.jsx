import { clsx } from "clsx";

import styles from "./BoxImage.module.css";

function BoxImage({ alt, size, src, className, ...props }) {
  return (
    <div className={clsx(styles.box, className)} {...props}>
      <img src={src} alt={alt} style={{ width: size, height: size }} />
    </div>
  );
}

export default BoxImage;
