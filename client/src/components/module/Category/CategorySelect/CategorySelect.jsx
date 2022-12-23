import { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { Select } from "@components/common";
import { Modal } from "@components/module";
import { useModal, useMutation, useQuery } from "@hooks";
import {
  createCategory as createCategoryService,
  deleteCategoryById,
  editCategoryById,
  getAllCategories,
} from "@services/category";
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
  ...props
}) {
  const deleteModal = useModal();
  const editModal = useModal();
  const queryClient = useQueryClient();

  const [category, setCategory] = useState(null);
  const { data: categories } = useQuery("categories", getAllCategories);

  const createCategory = useMutation(createCategoryService);
  const deleteCategory = useMutation(deleteCategoryById);
  const editCategory = useMutation(
    async ({ category_id, ...body }) => await editCategoryById(category_id, body)
  );

  const categoryValidationSchema = Yup.string()
    .label("Category")
    .matches(/^[\w\s\&]*$/, "Category must contain letters, digits, and spaces only.")
    .min(3)
    .max(50)
    .required();

  async function handleCreateCategory(value) {
    try {
      await categoryValidationSchema.validate(value);
      const { error, isRedirect, data } = await createCategory.execute({ name: value });

      if (isRedirect) return;
      if (error) return toast.error(format.error(error));

      await queryClient.invalidateQueries("categories");
      onChange({ value: data.category_id });
      toast.success("Successfully added category.");
    } catch ({ message }) {
      toast.error(message);
    }
  }

  async function handleEditCategory(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await editCategory.execute({
      name: values.category,
      category_id: category.value,
    });
    setSubmitting(false);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([
      queryClient.invalidateQueries("categories"),
      queryClient.invalidateQueries("products"),
    ]);

    editModal.close();
    setCategory(null);
    toast.success("Successfully edited category.");
  }

  async function handleDeleteCategory() {
    const { error, isRedirect } = await deleteCategory.execute(category.value);
    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([
      queryClient.invalidateQueries("categories"),
      queryClient.invalidateQueries("products"),
    ]);

    deleteModal.close();
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

  const disabled = deleteModal.isOpen || createCategory.isLoading;

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
        onCreateOption={handleCreateCategory}
        onChange={onChange}
        options={categories.map(({ category_id, name }) => ({ label: name, value: category_id }))}
        isLoading={disabled}
        isDisabled={disabled || isDisabled}
        isClearable
        {...props}
      />

      <Modal.CategoryDelete
        category={category?.label}
        open={deleteModal.isOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleDeleteCategory}
        disabledDelete={deleteCategory.isLoading}
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
