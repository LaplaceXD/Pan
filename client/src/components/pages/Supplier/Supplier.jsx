import React from "react";

import { Header, List, SearchBar } from "@components/common/index.js";
import { Supplier as SupplierModule, UserBanner } from "@components/module";
import filter from "@hooks/filter.js";
import useQuery from "@hooks/query.js";
import { getAllSuppliers } from "@services/supplier.js";

import styles from "./Supplier.module.css";

function Supplier() {
  const { data: suppliers } = useQuery("suppliers", getAllSuppliers);
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
        RenderComponent={({
          supplier_id,
          name,
          contact_no,
          street_no,
          street_name,
          building,
          city,
          zip_code,
        }) => (
          <SupplierModule.Item
            id={supplier_id}
            name={name}
            contactNumber={contact_no}
            streetNumber={street_no}
            streetName={street_name}
            building={building}
            city={city}
            zipCode={zip_code}
          />
        )}
      />
    </main>
  );
}

export default Supplier;
