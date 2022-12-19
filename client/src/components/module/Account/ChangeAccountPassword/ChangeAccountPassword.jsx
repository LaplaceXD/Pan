import styles from "./ChangeAccountPassword.module.css";
import { useFormik } from "formik";
import AccountField from "../AccountField";
import { useAuth } from "@hooks";
import * as Yup from "yup";
import AccountButton from "../AccountButton";

function ChangeAccountPassword({ newPassword, confirmPassword, leftBtn, rightBtn, ...props }) {
    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string().required("Password is required."),
        }),
    });

    return (
        <div className={styles.container}>
            <form method="POST" onSubmit={formik.handleSubmit} {...props}>
                <AccountField
                    label="Enter New Password:"
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    error={formik.touched.password && formik.errors.password}
                />
                <AccountField
                    label="Confirm New Password:"
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    error={formik.touched.password && formik.errors.password}
                />
            </form>
            <div className={styles.footer}>
                <AccountButton label={leftBtn}/>
                <AccountButton label={rightBtn} className={styles.secondary}/>
            </div>
        </div>
    );
}

export default ChangeAccountPassword;