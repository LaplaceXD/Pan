import React from 'react';
import styles from "./Modal.module.css";
import Modal from "./Modal.jsx";

function LogoutModal({open, onClose}) {

    if(!open) return null

    return (
        <Modal
            title="Logout?"
            subtitle="Are you sure you want to logout?"
            leftBtn="Cancel"
            rightBtn="Logout"
            leftOnClick={onClose}
        />
    )
}

export default LogoutModal