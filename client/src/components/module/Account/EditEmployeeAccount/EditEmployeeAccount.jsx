import { useFormik } from "formik";
import AccountField from "../AccountField";
import { useAuth } from "@hooks";
import * as Yup from "yup";
import styles from "./EditEmployeeAccount.module.css"
import AccountButton from "../AccountButton";

function EditEmployeeAccount({ firstName, lastName, email, contact, leftBtn, rightBtn, ...props  }) {
    const auth = useAuth();

    const formik = useFormik({
        initialValues: {
            firstName: `${firstName}`,
            lastName: `${lastName}`,
            email: `${email}`,
            contact: `${contact}`,
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email.").required("Email is required.")
        }),
    });

    return (
        <div className={styles.container}>
            <form method="POST" onSubmit={formik.handleSubmit} {...props}>
                <AccountField
                    label="First Name"
                    type="text"
                    id="firstName"
                    name="firstName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                />
                <AccountField
                    label="Last Name"
                    type="text"
                    id="lastName"
                    name="lastName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                />
                <AccountField
                    label="Email address"
                    type="text"
                    id="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    error={formik.touched.email && formik.errors.email}
                />
                <AccountField
                    label="Contact Number"
                    type="text"
                    id="contact"
                    name="contact"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.contact}
                />
            </form>
            <div className={styles.footer}>
                <AccountButton label={leftBtn}/>
                <AccountButton label={rightBtn}/>
            </div>
        </div>
    );
}

export default EditEmployeeAccount;