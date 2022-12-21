import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { Button, PasswordField } from "@components/common";
import { useMutation } from "@hooks";
import { changeEmployeePasswordById } from "@services/employee";
import format from "@utils/format";

import styles from "./ChangePasswordForm.module.css";

function EditForm({ id, onCancel, onSubmit }) {
  const changePassword = useMutation(
    async ({ employee_id, ...body }) => await changeEmployeePasswordById(employee_id, body)
  );

  const formik = useFormik({
    initialValues: { currentPass: "", newPass: "", confirmPass: "" },
    validationSchema: Yup.object({
      currentPass: Yup.string().label("Current Password").required(),
      newPass: Yup.string()
        .label("New Password")
        .min(8)
        .max(16)
        .matches(/\d/, "New Password must contain a digit.")
        .matches(/[A-Z]/, "New Password must contain an uppercase letter.")
        .matches(/[a-z]/, "New Password must contain a lowercase letter.")
        .matches(/[!@#$%^&*]/, "New Password must contain a special character (!@#$%^&*).")
        .required(),
      confirmPass: Yup.string()
        .label("Confirm Password")
        .test({
          name: "match_new_password",
          exclusive: true,
          message: "Confirm Password must match the New Password.",
          test: function (value, ctx) {
            return value === ctx.parent.newPass;
          },
        })
        .required(),
    }),
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      const { error, isRedirect } = await changePassword.execute({
        employee_id: id,
        current_password: values.currentPass,
        new_password: values.newPass,
      });
      formik.setSubmitting(false);

      if (isRedirect) return;
      if (error) return toast.error(format.error(error));

      toast.success("Account password changed successfully.");
      onSubmit();
    },
  });

  return (
    <form method="POST" className={styles.container} onSubmit={formik.handleSubmit}>
      <PasswordField
        label="Current Password"
        id="currentPass"
        name="currentPass"
        value={formik.values.currentPass}
        error={formik.touched.currentPass && formik.errors.currentPass}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <PasswordField
        label="New Password"
        id="newPass"
        name="newPass"
        value={formik.values.newPass}
        error={formik.touched.newPass && formik.errors.newPass}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <PasswordField
        label="Confirm Password"
        id="confirmPass"
        name="confirmPass"
        value={formik.values.confirmPass}
        error={formik.touched.confirmPass && formik.errors.confirmPass}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      <div className={styles.buttons}>
        <Button type="button" label="Cancel" onClick={onCancel} secondary />
        <Button type="submit" label="Save" disabled={formik.isSubmitting} />
      </div>
    </form>
  );
}

export default EditForm;
