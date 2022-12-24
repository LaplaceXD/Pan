import { useFormik } from "formik";
import { useId } from "react";
import * as Yup from "yup";

import { Button, Field } from "@components/common";
import format from "@utils/format";

function ReportForm({ className, onDownload }) {
  const id = useId();

  const formik = useFormik({
    initialValues: { start: "", end: "" },
    validationSchema: Yup.object({
      start: Yup.date().label("Start Date"),
      end: Yup.date().label("End Date"),
    }),
    onSubmit: (values) => {
      onDownload(values, formik.setSubmitting);
    },
  });

  return (
    <form method="POST" id={`Report-${id}`} onSubmit={formik.handleSubmit} className={className}>
      <Field
        type="date"
        label="Start Date"
        name="start"
        id="start"
        max={formik.values.end}
        error={formik.touched.start && formik.errors.start}
        value={formik.values.start}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />

      <Field
        type="date"
        label="End Date"
        name="end"
        id="end"
        min={formik.values.start}
        max={format.date(new Date(), true)}
        error={formik.touched.end && formik.errors.end}
        value={formik.values.end}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />

      <Button type="submit" label="Download Latest Report" disabled={formik.isSubmitting} />
    </form>
  );
}

export default ReportForm;
