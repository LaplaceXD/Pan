import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { FillButton } from "@components/common";
import { Stock, Supplier } from "@components/module";
import { useSupplier, useSuppliers } from "@hooks/services/supplier";
import format from "@utils/format";

import styles from "./SupplierPreview.module.css";

const views = {
  SUPPLIER_STOCK: Symbol(4),
  SUPPLIER_EDIT_FORM: Symbol(3),
  SUPPLIER_ADD_FORM: Symbol(2),
  SUPPLIER_DETAIL: Symbol(1),
  DEFAULT: Symbol(0),
};

function SupplierPreview({
  supplierId,
  showStockDeleteButton = false,
  showSupplierAddButton = false,
  showSupplierEditButton = false,
}) {
  const [view, setView] = useState(views.DEFAULT);
  const suppliersQuery = useSuppliers();
  const supplierQuery = useSupplier(supplierId);
  const {
    stocks: { data: stocks },
    payload: { data: supplier },
  } = supplierQuery;

  useEffect(() => setView(supplierId ? views.SUPPLIER_DETAIL : views.DEFAULT), [supplierId]);

  async function handleSupplierEdit(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await supplierQuery.update.execute(values);
    setSubmitting(false);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([suppliersQuery.invalidate(), supplierQuery.invalidate()]);
    setView(views.SUPPLIER_DETAIL);
    toast.success("Supplier edited successfully.");
  }

  async function handleSupplierAdd(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await suppliersQuery.create.execute(values);
    setSubmitting(false);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([suppliersQuery.invalidate(), supplierQuery.invalidate()]);
    setView(views.DEFAULT);
    toast.success("Supplier added successfully.");
  }

  async function handleSupplierStatusChange() {
    const { error, isRedirect } = await supplierQuery.toggleStatus.execute();
    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([suppliersQuery.invalidate(), supplierQuery.invalidate()]);
    toast.success("Supplier status toggled successfully.");
  }

  const viewDetails = {
    [views.SUPPLIER_STOCK]: (
      <Stock.Preview
        stocks={stocks}
        supplier={supplier}
        onBack={() => setView(views.SUPPLIER_DETAIL)}
        showStockDeleteButton={showStockDeleteButton}
        isLoading={supplierQuery.stocks.isLoading}
        disableSupplierField
      />
    ),
    [views.SUPPLIER_DETAIL]: (
      <Supplier.Detail
        id={supplier?.supplier_id}
        name={supplier?.name}
        building={supplier?.building}
        streetNumber={supplier?.street_no}
        streetName={supplier?.street_name}
        city={supplier?.city}
        zipCode={supplier?.zip_code}
        contactNumber={supplier?.contact_no}
        email={supplier?.email}
        isActive={supplier?.is_active}
        onEdit={() => setView(views.SUPPLIER_EDIT_FORM)}
        onViewStock={() => setView(views.SUPPLIER_STOCK)}
        onStatusChange={handleSupplierStatusChange}
        statusChangeDisabled={supplierQuery.toggleStatus.isLoading}
        showSupplierEditButton={showSupplierEditButton}
      />
    ),
    [views.SUPPLIER_EDIT_FORM]: (
      <Supplier.Form
        title="Supplier Edit Form"
        name={supplier?.name}
        building={supplier?.building}
        streetNumber={supplier?.street_no}
        streetName={supplier?.street_name}
        city={supplier?.city}
        zipCode={supplier?.zip_code}
        contactNumber={supplier?.contact_no}
        email={supplier?.email}
        isActive={supplier?.is_active}
        onCancel={() => setView(views.SUPPLIER_DETAIL)}
        onSubmit={handleSupplierEdit}
      />
    ),
    [views.SUPPLIER_ADD_FORM]: (
      <Supplier.Form
        title="Supplier Add Form"
        onCancel={() => setView(views.DEFAULT)}
        onSubmit={handleSupplierAdd}
      />
    ),
    [views.DEFAULT]: showSupplierAddButton ? (
      <FillButton
        className={styles.addBtn}
        label="Add new Supplier"
        onClick={() => setView(views.SUPPLIER_ADD_FORM)}
      />
    ) : null,
  };

  return <div className={styles.container}>{viewDetails[view]}</div>;
}

export default SupplierPreview;
