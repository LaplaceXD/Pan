import { useFormik } from "formik";
import { useId } from "react";
import * as Yup from "yup";

import { Button, Field } from "@components/common";
import format from "@utils/format";

function ReportForm({ className, onDownload }) {
  const id = useId();

  const [year, month] = format.date(new Date(), true).split("-");
  const previousMonth = parseInt(month) !== 1 ? [year, month - 1].join("-") : [year - 1, 12].join("-");

  const formik = useFormik({
    initialValues: { date: previousMonth },
    validationSchema: Yup.object({
      date: Yup.date().label("Date").required(),
    }),
    onSubmit: (values) => {
      onDownload({ month: values.date }, formik.setSubmitting);
    },
    enableReinitialize: true,
  });

  return (
    <form method="POST" id={`Report-${id}`} onSubmit={formik.handleSubmit} className={className}>
      <Field
        type="month"
        label="Date"
        name="date"
        id="date"
        max={previousMonth}
        error={formik.touched.date && formik.errors.date}
        value={formik.values.date}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />

      <Button
        type="submit"
        label={`Download ${formik.values.date !== previousMonth ? "Previous" : "Latest"} Report`}
        disabled={formik.isSubmitting}
      />
    </form>
  );
}

export default ReportForm;
