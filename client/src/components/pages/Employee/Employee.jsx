import empImg from "@assets/imgs/emp-img.jpg";
import format from "@utils/format";
import styles from "./Employee.module.css";

import { Button, Header, List } from "@components/common";
import { Employee as EmployeeModule, UserBanner } from "@components/module";
import { useEmployees } from "@hooks/services/employee";

function Employee() {
  const EmployeePreview = (
    <>
      <EmployeeModule.EmployeePreview className={styles.employeePreview}></EmployeeModule.EmployeePreview>
      <Button label="Add new Employee" />
    </>
  );

  const {
    payload: { data },
  } = useEmployees();
  const employees = data?.map(
    ({ employee_id, first_name, last_name, contact_no, date_employed, email }) => ({
      employee_id: format.id(employee_id),
      fullName: `${first_name} ${last_name}`,
      contact_no,
      date_employed: format.date(date_employed),
      email,
    })
  );

  return (
    <main className={styles.container}>
      <Header title="Employee List" className={styles.header}>
        {/* <SearchBar className={styles.search} /> */}
        <UserBanner imgSize={56} />
      </Header>
      <List
        className={styles.employeeList}
        column
        items={employees}
        itemKey={(employee) => employee.employee_id}
        RenderComponent={(employee) => (
          <EmployeeModule.EmployeeCard
            img={empImg}
            id={employee.employee_id}
            name={employee.fullName}
            contact_no={employee.contact_no}
            date={employee.date_employed}
          />
        )}
      />
    </main>
  );
}

export default Employee;
