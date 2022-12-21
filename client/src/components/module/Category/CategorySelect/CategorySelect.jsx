import { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { Select } from "@components/common";
import { Modal } from "@components/module";
import { useModal, useMutation, useQuery } from "@hooks";
import { createCategory as createCategoryService, getAllCategories } from "@services/category";
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

  const categoryValidationSchema = Yup.string().label("Category").min(3).max(80);

  async function handleCreateCategory(value) {
    try {
      await categoryValidationSchema.validate(value);
      const { error, isRedirect, data } = await createCategory.execute({ name: value });

      if (isRedirect) return;
      if (error) return toast.error(error);

      queryClient.invalidateQueries("categories");
      onChange({ value: data.category_id });
      toast.success("Successfully added category.");
    } catch ({ message }) {
      toast.error(message);
    }
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
          onOptionDelete: (value) => {
            deleteModal.open();
            setCategory(value);
          },
          onOptionEdit: (value) => {
            editModal.open();
            setCategory(value);
          },
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
        onClose={() => {
          deleteModal.close();
          setCategory(null);
        }}
        // onDelete={}
        // disabledDelete={}
      />

      <Modal.CategoryEdit
        value={category?.label}
        open={editModal.isOpen}
        onClose={() => {
          editModal.close();
          setCategory(null);
        }}
        // onSubmit={}
        validationSchema={categoryValidationSchema}
      />
    </>
  );
}

export default CategorySelect;
