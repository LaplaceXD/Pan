import styles from  "./Account.module.css"
import { Account as Card } from "../../module"
import { useAuth } from "@hooks";
import useQuery from "@hooks/query.js";
import { getEmployeeById } from "@services/employee.js";
import placeholderImg from "@assets/imgs/emp-img.jpg";
import {useState} from "react";
import format from "@utils/format";

function Account() {
    const { user } = useAuth();
    const { data: account } = useQuery(["account", user.id], ({ signal }) =>
        user.id ? getEmployeeById(user.id, { signal }) : null
    );
    const fullName = `${account?.first_name} ${account?.last_name}`;
    const capitalizedRole = account?.role.charAt(0).toUpperCase() + account?.role.slice(1);

    console.log(account);
    return (
        <div>
            <Card
                img={placeholderImg}
                header={capitalizedRole}
                name={fullName}
                id={format.id(account?.employee_id)}
                email={account?.email}
                contact={account?.contact_no}
            />
        </div>
    );
}

export default Account;