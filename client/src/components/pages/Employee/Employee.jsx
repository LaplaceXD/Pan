import empImg from "@assets/imgs/emp-img.jpg";
import styles from "./Employee.module.css";

import { Button, Header, List, SearchBar } from "@components/common";
import { Employee as EmployeeModule } from "@components/module";
import { PreviewLayout } from "@components/template";
import { useEmployees } from "@hooks/services/employee";

function Employee() {
  const {
    payload: { data },
  } = useEmployees();
  const employees = data?.map(({ first_name, last_name, ...values }) => ({
    fullName: `${first_name} ${last_name}`,
    ...values,
  }));

  const EmployeePreview = (
    <>
      <EmployeeModule.Preview className={styles.employeePreview}></EmployeeModule.Preview>
      <Button label="Add new Employee" />
    </>
  );

  return (
    <PreviewLayout PreviewComponent={EmployeePreview} className={styles.container}>
      <Header title="Employee List" className={styles.header}>
        <SearchBar className={styles.search} />
      </Header>

      <List
        className={styles.employeeList}
        column
        items={employees}
        itemKey={(employee) => employee.employee_id}
        RenderComponent={(employee) => (
          <EmployeeModule.Item
            img={empImg}
            id={employee.employee_id}
            name={employee.fullName}
            contact_no={employee.contact_no}
            date={employee.date_employed}
          />
        )}
      />
    </PreviewLayout>
  );
}

export default Employee;
