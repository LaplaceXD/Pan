import { useFormik } from "formik";
import * as Yup from "yup";

import banner from "@assets/imgs/login_banner.jpg";
import logo from "@assets/Logo_128x128.svg";
import { Button, Field } from "@components/common";

import styles from "./Login.module.css";

function Login() {
  const { handleSubmit, touched, errors, handleBlur, handleChange, values } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email.").required("Email is required."),
      password: Yup.string().required("Password is required."),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <main className={styles.container}>
      <img src={banner} alt="Bread." />

      <div className={styles.content}>
        <img src={logo} alt="Pan logo." />
        <p className={styles.subtitle}>Welcome back to Pan!</p>

        <form className={styles.form} method="POST" onSubmit={handleSubmit}>
          <Field
            label="Email:"
            type="text"
            id="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            error={touched.email && errors.email}
          />
          <Field
            label="Password:"
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            error={touched.password && errors.password}
          />

          <Button label="Login" type="submit" />
        </form>
      </div>
    </main>
  );
}

export default Login;
