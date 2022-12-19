import { AccountLayout } from "../../template";
import { Account as Acc } from "../../module"
import styles from "./Account.module.css"
import { useQuery, useAuth } from "@hooks";
import { getEmployeeById } from "@services/employee";
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
        <AccountLayout header={capitalizedRole} className={styles.container}>
            {/*<Acc.AccountPreview*/}
            {/*    name={fullName}*/}
            {/*    id={format.id(account?.employee_id)}*/}
            {/*    email={account?.email}*/}
            {/*    contact={account?.contact_no}*/}
            {/*    leftBtn={'Edit profile'}*/}
            {/*    rightBtn={'Change Password'}*/}
            {/*/>*/}
            {/*<Acc.EditEmployeeAccount*/}
            {/*    firstName={account?.first_name}*/}
            {/*    lastName={account?.last_name}*/}
            {/*    id={format.id(account?.employee_id)}*/}
            {/*    email={account?.email}*/}
            {/*    contact={account?.contact_no}*/}
            {/*    leftBtn={'Cancel'}*/}
            {/*    rightBtn={'Save'}*/}
            {/*/>*/}
            <Acc.ChangeAccountPassword
                leftBtn={'Cancel'}
                rightBtn={'Save'}
            />
        </AccountLayout>
    );
}

export default Account;