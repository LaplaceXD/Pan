import { useState } from "react";

import empImg from "@assets/imgs/emp-img.jpg";
import { Header, List, SearchBar } from "@components/common";
import { Employee as EmployeeModule } from "@components/module";
import { PreviewLayout } from "@components/template";
import { useFilter } from "@hooks";
import { useEmployees } from "@hooks/services/employee";
import format from "@utils/format";

import styles from "./Employee.module.css";
import EmployeePreview from "./EmployeePreview";

const search = {
  value: "",
  filter({ employee_id, fullName, contact_no, email }, search) {
    const searchLower = search.toLowerCase();
    const idMatched = format.id(employee_id).toLowerCase().includes(searchLower);
    const fullNameMatched = fullName.toLowerCase().includes(searchLower);
    const contactMatched = contact_no.toLowerCase().includes(searchLower);
    const emailMatched = email.toLowerCase().includes(searchLower);

    return idMatched || fullNameMatched || contactMatched || emailMatched;
  },
};

function Employee() {
  const [employeeId, setEmployeeId] = useState(null);
  const {
    payload: { data, isLoading },
  } = useEmployees();

  const employees = data?.map(({ first_name, last_name, ...values }) => ({
    fullName: `${first_name} ${last_name}`,
    ...values,
  }));

  const { filter, data: filteredData } = useFilter(employees, { search });

  return (
    <PreviewLayout
      PreviewComponent={<EmployeePreview employeeId={employeeId} />}
      className={styles.container}
    >
      <Header title="Employee List" className={styles.header}>
        <SearchBar
          className={styles.search}
          onSearch={(e) => filter.handleSearch(e.currentTarget.value)}
          value={filter.search}
        />
      </Header>

      <List
        className={styles.list}
        column
        items={filteredData}
        itemKey={(employee) => employee.employee_id}
        isLoading={isLoading}
        emptyLabel="There are no employees to display."
        RenderComponent={({ employee_id, fullName, contact_no, date_employed }) => (
          <EmployeeModule.Item
            img={empImg}
            id={employee_id}
            name={fullName}
            contactNumber={contact_no}
            date={date_employed}
            onClick={() => setEmployeeId(employeeId === employee_id ? null : employee_id)}
            isSelected={employeeId === employee_id}
          />
        )}
      />
    </PreviewLayout>
  );
}

export default Employee;
