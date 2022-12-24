import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { Select } from "@components/common";
import { Modal } from "@components/module";
import { useModal } from "@hooks";
import { useCategories, useCategory } from "@hooks/services/category";
import { useProducts } from "@hooks/services/product";
import format from "@utils/format";

import CategoryOption from "../CategoryOption";

function CategorySelect({
  label,
  id,
  onCreateOption,
  options,
  isClearable,
  onChange,
  isDisabled,
  value,
  ...props
}) {
  const deleteModal = useModal();
  const editModal = useModal();
  const productsQuery = useProducts();

  const [category, setCategory] = useState(null);
  const categoryQuery = useCategory(category?.value);
  const categoriesQuery = useCategories();
  const {
    payload: { data: categories },
  } = categoriesQuery;

  const categoryValidationSchema = Yup.string()
    .label("Category")
    .matches(/^[\w\s\&]*$/, "Category must contain letters, digits, and spaces only.")
    .min(3)
    .max(50)
    .required();

  async function handleCreateCategory(value) {
    try {
      await categoryValidationSchema.validate(value);
      const { error, isRedirect, data } = await categoriesQuery.create.execute({ name: value });

      if (isRedirect) return;
      if (error) return toast.error(format.error(error));

      await categoriesQuery.invalidate();
      onChange({ value: data.category_id });
      toast.success("Successfully added category.");
    } catch ({ message }) {
      toast.error(message);
    }
  }

  async function handleEditCategory(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await categoryQuery.update.execute({ name: values.category });
    setSubmitting(false);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([categoriesQuery.invalidate(), productsQuery.invalidate()]);
    editModal.close();
    setCategory(null);
    toast.success("Successfully edited category.");
  }

  async function handleDeleteCategory() {
    const { error, isRedirect } = await categoryQuery.delete.execute();
    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([categoriesQuery.invalidate(), productsQuery.invalidate()]);
    deleteModal.close();
    if (category.value === value) onChange({ value: 0 });
    setCategory(null);
    toast.success("Successfully deleted category.");
  }

  function handleOptionDelete(value) {
    deleteModal.open();
    setCategory(value);
  }

  function handleOptionEdit(value) {
    editModal.open();
    setCategory(value);
  }

  function handleDeleteModalClose() {
    deleteModal.close();
    setCategory(null);
  }

  function handleEditModalClose() {
    editModal.close();
    setCategory(null);
  }

  const disabled = deleteModal.isOpen || categoriesQuery.create.isLoading;

  return (
    <>
      <Select
        label="Category"
        id="category"
        components={{ Option: CategoryOption }}
        selectProps={{
          categories,
          onOptionDelete: handleOptionDelete,
          onOptionEdit: handleOptionEdit,
        }}
        value={value}
        onCreateOption={handleCreateCategory}
        onChange={onChange}
        options={categories.map(({ category_id, name }) => ({ label: name, value: category_id }))}
        isLoading={disabled}
        isDisabled={disabled || isDisabled}
        isClearable
        isCreatable
        {...props}
      />

      <Modal.CategoryDelete
        category={category?.label}
        open={deleteModal.isOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleDeleteCategory}
        deleteDisabled={categoryQuery.delete.isLoading}
      />

      <Modal.CategoryEdit
        value={category?.label}
        open={editModal.isOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditCategory}
        validationSchema={categoryValidationSchema}
      />
    </>
  );
}

export default CategorySelect;
