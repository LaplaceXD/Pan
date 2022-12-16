import { UserBanner } from "@components/module";
import { clsx } from "clsx";
import styles from "./PreviewLayout.module.css";

function PreviewLayout({ className, PreviewComponent, children, useOutlet }) {
  return (
    <div className={styles.container}>
      <main className={clsx(styles.main, className)}>{useOutlet ? <Outlet /> : children}</main>

      <aside className={styles.preview}>
        <UserBanner />
        {PreviewComponent}
      </aside>
    </div>
  );
}

export default PreviewLayout;
