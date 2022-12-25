import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import empImg from "@assets/imgs/emp-img.jpg";
import { FillButton } from "@components/common";
import { Employee } from "@components/module";
import { useEmployee, useEmployees } from "@hooks/services/employee";
import format from "@utils/format";

import styles from "./EmployeePreview.module.css";

const views = {
  EMPLOYEE_EDIT_FORM: Symbol(3),
  EMPLOYEE_ADD_FORM: Symbol(2),
  EMPLOYEE_DETAIL: Symbol(1),
  DEFAULT: Symbol(0),
};

function EmployeePreview({ employeeId }) {
  const [view, setView] = useState(views.DEFAULT);
  const employeesQuery = useEmployees();
  const employeeQuery = useEmployee(employeeId);
  const {
    payload: { data: employee },
  } = employeeQuery;

  useEffect(() => setView(employeeId ? views.EMPLOYEE_DETAIL : views.DEFAULT), [employeeId]);

  async function handleEmployeeEdit(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await employeeQuery.update.execute(values);
    setSubmitting(false);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([employeesQuery.invalidate(), employeeQuery.invalidate()]);
    setView(views.EMPLOYEE_DETAIL);
    toast.success("Employee edited successfully.");
  }

  async function handleEmployeeAdd(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await employeesQuery.create.execute(values);
    setSubmitting(false);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([employeesQuery.invalidate(), employeeQuery.invalidate()]);
    setView(views.DEFAULT);
    toast.success("Employee added successfully.");
  }

  async function handleEmployeeResetPassword() {
    const { error, isRedirect } = await employeeQuery.resetPassword.execute();
    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    toast.success("Employee password reset successfully.");
  }

  async function handleEmployeeStatusChange() {
    const { error, isRedirect } = await employeeQuery.toggleStatus.execute();
    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([employeesQuery.invalidate(), employeeQuery.invalidate()]);
    toast.success("Employee status toggled successfully.");
  }

  const viewDetails = {
    [views.EMPLOYEE_DETAIL]: (
      <Employee.Detail
        img={empImg}
        id={employee?.employee_id}
        name={employee && `${employee.first_name} ${employee.last_name}`}
        email={employee?.email}
        contactNumber={employee?.contact_no}
        dateEmployed={employee?.date_employed}
        isActive={employee?.is_active}
        onResetPassword={handleEmployeeResetPassword}
        onStatusChange={handleEmployeeStatusChange}
        onEdit={() => setView(views.EMPLOYEE_EDIT_FORM)}
        resetPasswordDisabled={employeeQuery.resetPassword.isLoading}
        statusChangeDisabled={employeeQuery.toggleStatus.isLoading}
      />
    ),
    [views.EMPLOYEE_EDIT_FORM]: (
      <Employee.Form
        title="Employee Edit Details"
        img={empImg}
        firstName={employee?.first_name}
        lastName={employee?.last_name}
        contactNumber={employee?.contact_no}
        email={employee?.email}
        dateEmployed={employee?.date_employed}
        onCancel={() => setView(views.EMPLOYEE_DETAIL)}
        onSubmit={handleEmployeeEdit}
      />
    ),
    [views.EMPLOYEE_ADD_FORM]: (
      <Employee.Form
        title="Employee Edit Details"
        img={empImg}
        onCancel={() => setView(views.EMPLOYEE_DETAIL)}
        onSubmit={handleEmployeeAdd}
      />
    ),
    [views.DEFAULT]: (
      <FillButton
        className={styles.addBtn}
        label="Add new Employee"
        onClick={() => setView(views.EMPLOYEE_ADD_FORM)}
      />
    ),
  };

  return <div className={styles.container}>{viewDetails[view]}</div>;
}

export default EmployeePreview;
