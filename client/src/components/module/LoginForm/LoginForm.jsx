import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { Button, Field } from "@components/common";
import { loginEmployee } from "@services/auth";

function LoginForm({ ...props }) {
  const navigate = useNavigate();

  const { handleSubmit, touched, errors, handleBlur, handleChange, values, setSubmitting, isSubmitting } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: Yup.object({
        email: Yup.string().email("Invalid email.").required("Email is required."),
        password: Yup.string().required("Password is required."),
      }),
      onSubmit: async (values) => {
        setSubmitting(true);
        const { error, access, refresh } = await loginEmployee(values);

        if (error) {
          console.log("ERROR!");
          setSubmitting(false);
        }

        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        navigate("/");
      },
    });

  return (
    <form method="POST" onSubmit={handleSubmit} {...props}>
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

      <Button label="Login" type="submit" disabled={isSubmitting} />
    </form>
  );
}

export default LoginForm;
