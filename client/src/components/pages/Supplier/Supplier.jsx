import React from "react";
import {Header, List, SearchBar} from "@components/common/index.js";
import { UserBanner } from "@components/module/index.js";
import filter from "@hooks/filter.js";

import styles from "./Supplier.module.css";
import SupplierItem from "@components/module/Supplier/index.js";
import useQuery from "@hooks/query.js";
import {getAllSuppliers} from "@services/supplier.js";

function Supplier() {
    const { data: suppliers } = useQuery("suppliers", getAllSuppliers);
    console.log(suppliers)
    return (
        <main className={styles.container}>
            <Header title="Supplier List" className={styles.header}>
                <SearchBar
                    className={styles.search}
                    value={filter.search}
                    onSearch={(e) => filter.handleSearch(e.currentTarget.value)}
                />
                <UserBanner imgSize={56} />
            </Header>

            <List
                column
                className={styles.supplierItem}
                items={suppliers}
                itemKey={(suppliers) => suppliers.supplier_id}
                RenderComponent={({ supplier_id, name, contact_no, street_no, street_name, building, city, zip_code}) => (
                    <SupplierItem
                        id={supplier_id}
                        name={name}
                        number={contact_no}
                        str_no={street_no}
                        str_name={street_name}
                        bldg={building}
                        city={city}
                        zip_code={zip_code}
                    />
                )}
            />
        </main>
    );
}

export default Supplier;