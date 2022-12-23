import React from "react";

import { Button, Header, List, SearchBar } from "@components/common/index.js";
import { Supplier as SupplierModule } from "@components/module";
import { PreviewLayout } from "@components/template";
import { useFilter, useQuery } from "@hooks";
import { getAllSuppliers } from "@services/supplier.js";

import format from "@utils/format";

import styles from "./Supplier.module.css";

const search = {
  value: "",
  filter: ({ supplier_id, name, contact_no, address }, search) => {
    const searchLower = search.toLowerCase();

    const supplierMatch = format.id(supplier_id, "SupplierID").toLowerCase().includes(searchLower);
    const nameMatch = name.toLowerCase().includes(searchLower);
    const contactNumberMatch = contact_no.toLowerCase().includes(searchLower);
    const addressMatch = address.toLowerCase().includes(searchLower);

    return supplierMatch || nameMatch || contactNumberMatch || addressMatch;
  },
};

function Supplier() {
  const { data } = useQuery("suppliers", getAllSuppliers);
  const suppliers = data?.map(({ supplier_id, name, contact_no, ...address }) => ({
    supplier_id,
    name,
    contact_no,
    address: format.address(address),
  }));
  const { filter, data: filteredSuppliers } = useFilter(suppliers, { search });

  const supplierPreview = (
    <>
      <SupplierModule.Preview className={styles.supplierPreview} />
      <Button label="Add New Supplier" />
    </>
  );

  return (
    <PreviewLayout PreviewComponent={supplierPreview} className={styles.container}>
      <Header title="Supplier List" className={styles.header}>
        <SearchBar
          className={styles.search}
          value={filter.search}
          onSearch={(e) => filter.handleSearch(e.currentTarget.value)}
        />
      </Header>

      <List
        column
        className={styles.supplierItem}
        items={filteredSuppliers}
        itemKey={(suppliers) => suppliers.supplier_id}
        RenderComponent={({ supplier_id, name, contact_no, address }) => (
          <SupplierModule.Item id={supplier_id} name={name} contactNumber={contact_no} address={address} />
        )}
      />
    </PreviewLayout>
  );
}

export default Supplier;
