import React from "react";
import {Link} from "react-router-dom";
import styles from "./MainLayout.module.css";
import { FiHome, FiTruck, FiUser, FiLogOut } from 'react-icons/fi';
import { BiNotepad } from 'react-icons/bi';
import { BsBoxSeam } from 'react-icons/bs';
import logo from "@assets/Logo_128x128.svg";

function MainLayout({children}) {
    return (
        <div className={styles.layout}>
            <header>
                <div className={styles.navLink}>
                    <div className={styles.logo}>
                        <img src={logo} alt="Pan logo." />
                    </div>
                    <Link to="/"><FiHome className={styles.navIcon}/>Home</Link>
                    <Link to="/order"><BiNotepad className={styles.navIcon}/>Orders</Link>
                    <Link to="/product"><BsBoxSeam className={styles.navIcon}/>Products</Link>
                    <Link to="/supplier"><FiTruck className={styles.navIcon}/>Supplier</Link>
                </div>
                <div className={styles.navLink}>
                    <Link to="/account"><FiUser className={styles.navIcon}/>Account</Link>
                    <Link to="/login"><FiLogOut className={styles.navIcon}/>Logout</Link>
                </div>
            </header>
            <main>
                <div>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default MainLayout