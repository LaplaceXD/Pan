import { useFormik } from "formik";
import * as Yup from "yup";

import { Button, Field, Select, TextAreaField } from "@components/common";
import { useProducts } from "@hooks/services/product";
import { useSuppliers } from "@hooks/services/supplier";
import check from "@utils/check";

import styles from "./StockForm.module.css";

function StockForm({
  productId = 0,
  supplierId = 0,
  quantity = 0,
  unit = "",
  price = 0,
  notes = "",
  dateSupplied = "",
  disableProductField = false,
  disableSupplierField = false,
  onCancel,
  onSubmit,
}) {
  const {
    payload: { data: products },
  } = useProducts();
  const {
    payload: { data: suppliers },
  } = useSuppliers();

  const product = products?.find(({ product_id }) => product_id === productId);
  const supplier = suppliers?.find(({ supplier_id }) => supplier_id === supplierId);

  // if the field is disabled only show the current item as the only option
  // else filter the array for the active ones along with the current item
  const selectableProducts = disableProductField
    ? [product].filter(Boolean)
    : products?.filter(({ product_id, is_available }) => is_available || product_id === productId);
  const selectableSuppliers = disableSupplierField
    ? [supplier].filter(Boolean)
    : suppliers?.filter(({ supplier_id, is_active }) => is_active || supplier_id === supplierId);

  const formik = useFormik({
    initialValues: {
      product: productId,
      supplier: supplierId,
      quantity,
      unit,
      price,
      notes,
      dateSupplied,
    },
    validationSchema: Yup.object({
      product: Yup.number().integer().label("Product").min(1, "Product is required.").required(),
      supplier: Yup.number().integer().label("Supplier").min(1, "Supplier is required.").required(),
      unit: Yup.string().label("Unit").min(2).max(5).required(),
      quantity: Yup.number().integer().label("Quantity").min(1).required(),
      price: Yup.number().label("Unit Price").min(0.01).required(),
      notes: Yup.string().label("Notes").min(2).max(400),
      dateSupplied: Yup.date().label("Date Supplied").max(new Date()).required(),
    }),
    onSubmit: (values) => {
      onSubmit(
        {
          product_id: values.product,
          supplier_id: values.supplier,
          date_supplied: values.dateSupplied,
          quantity: values.quantity,
          unit: values.unit,
          unit_price: values.price,
          notes: values.notes,
        },
        formik.setSubmitting
      );
    },
    enableReinitialize: true,
  });

  function handlePriceChange(e) {
    const checks = { maxIntLength: 5, maxFracLength: 2 };
    if (check.number(e.currentTarget.value, checks)) formik.handleChange(e);
  }

  return (
    <form method="POST" className={styles.container} onSubmit={formik.handleSubmit}>
      <fieldset>
        <Select
          label="Supplier"
          id="supplier"
          options={selectableSuppliers?.map(({ supplier_id, name }) => ({
            label: name,
            value: supplier_id,
          }))}
          filterOption={(item) => item.value !== supplierId || supplier?.is_active}
          isDisabled={disableSupplierField}
          onChange={(item) => formik.setFieldValue("supplier", item.value)}
          onBlur={formik.handleBlur}
          value={formik.values.supplier}
          error={formik.touched.supplier && formik.errors.supplier}
        />
        <Select
          label="Product"
          id="product"
          options={selectableProducts?.map(({ product_id, name }) => ({ label: name, value: product_id }))}
          filterOption={(item) => item.value !== productId || product?.is_available}
          isDisabled={disableProductField}
          onChange={(item) => formik.setFieldValue("product", item.value)}
          onBlur={formik.handleBlur}
          value={formik.values.product}
          error={formik.touched.product && formik.errors.product}
        />
      </fieldset>

      <Field
        type="number"
        label="Quantity"
        name="quantity"
        id="quantity"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.quantity}
        error={formik.touched.quantity && formik.errors.quantity}
      />

      <fieldset>
        <Field
          type="text"
          label="Unit"
          name="unit"
          id="unit"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.unit}
          error={formik.touched.unit && formik.errors.unit}
        />
        <Field
          type="number"
          label="Unit Price"
          name="price"
          id="price"
          onChange={handlePriceChange}
          onBlur={formik.handleBlur}
          value={formik.values.price}
          error={formik.touched.price && formik.errors.price}
        />
      </fieldset>

      <Field
        type="date"
        label="Date Supplied"
        name="dateSupplied"
        id="dateSuplied"
        max={new Date().toISOString().split("T")[0]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.dateSupplied?.split("T")[0]}
        error={formik.touched.dateSupplied && formik.errors.dateSupplied}
      />

      <TextAreaField
        label="Notes"
        name="notes"
        id="notes"
        className={styles.notes}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.notes}
        error={formik.touched.notes && formik.errors.notes}
      />

      <div className={styles.buttons}>
        <Button type="button" label="Cancel" onClick={onCancel} secondary />
        <Button type="submit" label="Save" disabled={formik.isSubmitting} />
      </div>
    </form>
  );
}

export default StockForm;
