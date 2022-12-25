import { useState } from "react";

import { Header, List, SearchBar } from "@components/common/index.js";
import { Supplier as SupplierModule } from "@components/module";
import { PreviewLayout } from "@components/template";
import { useFilter } from "@hooks";
import { useSuppliers } from "@hooks/services/supplier";
import format from "@utils/format";

import styles from "./Supplier.module.css";
import SupplierPreview from "./SupplierPreview";

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

function Supplier({
  showStockDeleteButton = false,
  showSupplierAddButton = false,
  showSupplierEditButton = false,
}) {
  const {
    payload: { data, isLoading },
  } = useSuppliers();
  const suppliers = data?.map(({ supplier_id, name, contact_no, ...address }) => ({
    supplier_id,
    name,
    contact_no,
    address: format.address(address),
  }));
  const { filter, data: filteredSuppliers } = useFilter(suppliers, { search });

  const [supplierId, setSupplierId] = useState(null);

  const PreviewComponent = (
    <SupplierPreview
      supplierId={supplierId}
      showStockDeleteButton={showStockDeleteButton}
      showSupplierAddButton={showSupplierAddButton}
      showSupplierEditButton={showSupplierEditButton}
    />
  );

  return (
    <PreviewLayout PreviewComponent={PreviewComponent} className={styles.container}>
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
        isLoading={isLoading}
        emptyLabel="There are no suppliers to list."
        RenderComponent={({ supplier_id, name, contact_no, address }) => (
          <SupplierModule.Item
            id={supplier_id}
            name={name}
            contactNumber={contact_no}
            address={address}
            onClick={() => setSupplierId(supplierId === supplier_id ? null : supplier_id)}
            isSelected={supplier_id === supplierId}
          />
        )}
      />
    </PreviewLayout>
  );
}

export default Supplier;
