import { clsx } from "clsx";

import styles from "./BoxImage.module.css";

function BoxImage({ alt, size, src, className, style, ...props }) {
  return (
    <div className={clsx(styles.box, className)} style={{ width: size, height: size }} {...props}>
      <img src={src} alt={alt} />
    </div>
  );
}

export default BoxImage;
