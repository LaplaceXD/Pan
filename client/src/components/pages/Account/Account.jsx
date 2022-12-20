import { AccountLayout } from "../../template";
import { Account as Acc } from "../../module"
import styles from "./Account.module.css"
import { useQuery, useAuth } from "@hooks";
import { getEmployeeById } from "@services/employee";
import format from "@utils/format";
import {useState} from "react";

function Account() {
    const [editState, setEditState] = useState(0);

    const { user } = useAuth();
    const { data: account } = useQuery(["account", user.id], ({ signal }) =>
        user.id ? getEmployeeById(user.id, { signal }) : null
    );
    const fullName = `${account?.first_name} ${account?.last_name}`;
    const capitalizedRole = account?.role.charAt(0).toUpperCase() + account?.role.slice(1);

    console.log(account);

    const thisHeader = editState === 0 ? capitalizedRole : (editState === 1 ? `Edit ${capitalizedRole} Profile` : 'Change Password');

    return (
        <AccountLayout header={thisHeader} className={styles.container}>
            <Acc.AccountPreview
                firstName={account?.first_name}
                lastName={account?.last_name}
                fullName={fullName}
                id={format.id(account?.employee_id)}
                email={account?.email}
                contact={account?.contact_no}
                editState={editState}
                setEditState={setEditState}
            />
        </AccountLayout>
    );
}

export default Account;