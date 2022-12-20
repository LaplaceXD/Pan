import styles from "./AccountLayout.module.css"
import placeholderImg from "@assets/imgs/emp-img.jpg";
import { clsx } from "clsx";

import { BoxImage } from "@components/common";

function AccountLayout({ imgSize = 250, editState, PreviewComponent, children, className, header, useOutlet }) {
    return (
        <div className={styles.container}>


            <aside className={styles.preview}>
                <div className={styles.header}>{header}</div>
                <div className={styles.content}>
                    <BoxImage
                        src={placeholderImg}
                        alt={`Name's profile picture.`}
                        size={imgSize}
                        className={styles.img}
                    />
                    <main className={clsx(styles.main, className)}>{useOutlet ? <Outlet /> : children}</main>
                </div>
                {/*{PreviewComponent}*/}
            </aside>

        </div>
    );
}

export default AccountLayout;