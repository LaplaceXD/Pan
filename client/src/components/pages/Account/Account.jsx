import { useState, useEffect, Fragment } from "react";

import empImg from "@assets/imgs/emp-img.jpg";
import { BoxImage } from "@components/common";
import { Account as AccountModule } from "@components/module";
import { useAuth, useQuery } from "@hooks";
import { getEmployeeById } from "@services/employee";
import format from "@utils/format";
import styles from "./Account.module.css";
import { pages } from "@utils";

function Account() {
    const [ page, setPage ] = useState(pages.DETAILS);
    const [ user, setUser ] = useState(useAuth()[ 'user' ]);
    const [ account, setAccount ] = useState({
        first_name: '', last_name: '', email: '', contact_no: ''
    })

    if ( user ) {
        useQuery([ "account", user.id ], ({ signal }) => {
            getEmployeeById(user.id, { signal }).then(({ data: account }) => setAccount(account))
        });
    }

    useEffect(() => {
        console.log('----------------------------------------');
        console.log('[Account -> useEffect] account:', account);
        console.log('[Account -> useEffect] page   :', page);
    }, [ account, page ]);

    const pageDetails = {
        [ pages.DETAILS ]: {
            header: format.capitalize(user.role),
            content: (<AccountModule.Details
                id={user.id}
                name={`${account?.first_name} ${account?.last_name}`}
                email={account?.email}
                contact={account?.contact_no}
                onEditClick={() => setPage(pages.EDIT)}
                onChangePassClick={() => setPage(pages.CHANGE_PASSWORD)}
            />),
        }, [ pages.EDIT ]: {
            header: `Edit ${format.capitalize(user.role)} Profile`,
            content: (<AccountModule.EditForm
                id={user.id}
                first_name={account?.first_name}
                last_name={account?.last_name}
                email={account?.email}
                contact_no={account?.contact_no}
                setPage={page => setPage(page)}
                setAccount={account => setAccount(account)}
            />),
        }, [ pages.CHANGE_PASSWORD ]: {
            header: "Change Password",
            content: <AccountModule.ChangePasswordForm onCancel={() => setPage(pages.DETAILS)}/>,
        },
    };

    return (<main className={styles.page}>
        <section className={styles.container}>
            <BoxImage src={empImg} alt={`Name's profile picture.`} size={312} className={styles.img}/>
            {
                (page && page !== pages.RELOAD) &&
                <Fragment>
                    {pageDetails[ page ].content}
                    <h1 className={styles.header}>{pageDetails[ page ].header}</h1>
                </Fragment>
            }
            {
                (!page || page === pages.RELOAD) &&
                <h4 className={styles.loading}>Loading... Please wait!</h4>
            }
        </section>
    </main>);
}

export default Account;
