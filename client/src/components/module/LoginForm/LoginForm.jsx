import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { Button, Field } from "@components/common";
import useAuth from "@hooks/auth/useAuth";

function LoginForm({ ...props }) {
  const navigate = useNavigate();
  const auth = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email.").required("Email is required."),
      password: Yup.string().required("Password is required."),
    }),
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      const error = await auth.login(values);

      if (error) {
        formik.setSubmitting(false);
        toast.error("Invalid credentials.");
      } else {
        navigate("/");
        toast.success("Logged in.");
      }
    },
  });

  return (
    <form method="POST" onSubmit={formik.handleSubmit} {...props}>
      <Field
        label="Email:"
        type="text"
        id="email"
        name="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
        error={formik.touched.email && formik.errors.email}
      />
      <Field
        label="Password:"
        type="password"
        id="password"
        name="password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
        error={formik.touched.password && formik.errors.password}
      />

      <Button label="Login" type="submit" disabled={formik.isSubmitting} />
    </form>
  );
}

export default LoginForm;
