import { useState } from "react";

import empImg from "@assets/imgs/emp-img.jpg";
import { BoxImage } from "@components/common";
import { Account as AccountModule } from "@components/module";
import { useAuth, useQuery } from "@hooks";
import { getEmployeeById } from "@services/employee";
import format from "@utils/format";

import styles from "./Account.module.css";

const views = {
  DETAILS: Symbol(0),
  EDIT: Symbol(1),
  CHANGE_PASSWORD: Symbol(2),
};

function Account() {
  const [view, setview] = useState(views.DETAILS);

  const { user } = useAuth();
  const { data: account } = useQuery(["account", user.id], ({ signal }) =>
    user.id ? getEmployeeById(user.id, { signal }) : null
  );
  const fullName = `${account?.first_name} ${account?.last_name}`;

  const viewDetails = {
    [views.DETAILS]: {
      header: format.capitalize(user.role),
      content: (
        <AccountModule.Details
          id={user.id}
          name={account && fullName}
          email={account?.email}
          contact={account?.contact_no}
          onEditClick={() => setview(views.EDIT)}
          onChangePassClick={() => setview(views.CHANGE_PASSWORD)}
        />
      ),
    },
    [views.EDIT]: {
      header: `Edit ${format.capitalize(user.role)} Profile`,
      content: (
        <AccountModule.EditForm
          id={user.id}
          firstName={account?.first_name}
          lastName={account?.last_name}
          email={account?.email}
          contact={account?.contact_no}
          onCancel={() => setview(views.DETAILS)}
          onSubmit={() => setview(views.DETAILS)}
        />
      ),
    },
    [views.CHANGE_PASSWORD]: {
      header: "Change Password",
      content: (
        <AccountModule.ChangePasswordForm
          id={user.id}
          onCancel={() => setview(views.DETAILS)}
          onSubmit={() => setview(views.DETAILS)}
        />
      ),
    },
  };

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <BoxImage src={empImg} alt={`Name's profile picture.`} size={312} className={styles.img} />
        {viewDetails[view].content}
        <h1 className={styles.header}>{viewDetails[view].header}</h1>
      </section>
    </main>
  );
}

export default Account;
