import { useState } from "react";

import empImg from "@assets/imgs/emp-img.jpg";
import { BoxImage } from "@components/common";
import { Account as AccountModule } from "@components/module";
import { useAuth, useQuery } from "@hooks";
import { getEmployeeById } from "@services/employee";
import format from "@utils/format";

import styles from "./Account.module.css";

const pages = {
  DETAILS: Symbol(0),
  EDIT: Symbol(1),
  CHANGE_PASSWORD: Symbol(2),
};

function Account() {
  const [page, setPage] = useState(pages.DETAILS);

  const { user } = useAuth();
  const { data: account } = useQuery(["account", user.id], ({ signal }) =>
    user.id ? getEmployeeById(user.id, { signal }) : null
  );
  const fullName = `${account?.first_name} ${account?.last_name}`;

  const pageDetails = {
    [pages.DETAILS]: {
      header: format.capitalize(user.role),
      content: (
        <AccountModule.Details
          id={user.id}
          name={fullName}
          email={account?.email}
          contact={account?.contact_no}
          onEditClick={() => setPage(pages.EDIT)}
          onChangePassClick={() => setPage(pages.CHANGE_PASSWORD)}
        />
      ),
    },
    [pages.EDIT]: {
      header: `Edit ${format.capitalize(user.role)} Profile`,
      content: (
        <AccountModule.EditForm
          id={user.id}
          firstName={account?.first_name}
          lastName={account?.last_name}
          email={account?.email}
          contact={account?.contact_no}
          onCancel={() => setPage(pages.DETAILS)}
        />
      ),
    },
    [pages.CHANGE_PASSWORD]: {
      header: "Change Password",
      content: <AccountModule.ChangePasswordForm onCancel={() => setPage(pages.DETAILS)} />,
    },
  };

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <BoxImage src={empImg} alt={`Name's profile picture.`} size={312} className={styles.img} />
        {pageDetails[page].content}
        <h1 className={styles.header}>{pageDetails[page].header}</h1>
      </section>
    </main>
  );
}

export default Account;
