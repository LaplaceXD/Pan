import { useId } from "react";

import { Button, Field } from "@components/common";

function ReportForm({ className }) {
  const id = useId();

  return (
    <form method="POST" id={`Report-${id}`} className={className}>
      <Field type="date" label="Start Date" name="startDate" id="startDate" />
      <Field type="date" label="End Date" name="endDate" id="endDate" />
      <Button type="submit" label="Download Latest Report" />
    </form>
  );
}

export default ReportForm;
