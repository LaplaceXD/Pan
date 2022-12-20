import styles from "./AccountPreview.module.css";
import AccountButton from "../AccountButton";
import AccountField from "../AccountField";
import React, { useState } from "react";
import { useFormik } from "formik";
import { useAuth } from "@hooks";

function AccountPreview({ editState, setEditState, firstName, lastName, fullName, id, email, contact, leftBtn, rightBtn }) {
    const auth = useAuth();

    const formik = useFormik({
        initialValues: {
            firstName: `${firstName}`,
            lastName: `${lastName}`,
            email: `${email}`,
            contact: `${contact}`,
        },
    });

    console.log(firstName);

    return (
        <div>
            {
                editState === 0 &&
                <div>
                    <h1 className={styles.name}>{fullName}</h1>
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
            }
            {
                editState === 1 &&
                <div>
                    <form method="POST">
                        <AccountField
                            label="First Name"
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formik.values.firstName}
                        />
                        <AccountField
                            label="Last Name"
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formik.values.lastName}
                        />
                        <AccountField
                            label="Email address"
                            type="text"
                            id="email"
                            name="email"
                            value={formik.values.email}
                        />
                        <AccountField
                            label="Contact Number"
                            type="text"
                            id="contact"
                            name="contact"
                            value={formik.values.contact}
                        />
                    </form>
                </div>
            }
            {
                editState === 2 &&
                <form method="POST">
                    <AccountField
                        label="Enter New Password:"
                        type="password"
                        id="newPassword"
                        name="newPassword"
                    />
                    <AccountField
                        label="Confirm New Password:"
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                    />
                </form>
            }
            <div className={styles.footer}>
                <AccountButton label={editState===0 ? 'Edit Profile' : 'Cancel'} onClick={() => setEditState(editState === 0 ? 1 :  0)}/>
                <AccountButton
                    className={editState !== 0 ? styles.buttonYellow : ''}
                    label={editState===0 ? 'Change Password' : 'Save'}
                    onClick={() => setEditState(editState === 0 ? 2 :  0)}/>
            </div>
        </div>
    );
}

export default AccountPreview;