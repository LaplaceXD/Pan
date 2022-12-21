import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { Select } from "@components/common";
import { useMutation, useQuery } from "@hooks";
import { createCategory as createCategoryService, getAllCategories } from "@services/category";

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
  const queryClient = useQueryClient();
  const { data: categories } = useQuery("categories", getAllCategories);
  const createCategory = useMutation(createCategoryService);

  async function handleCreateOption(value) {
    try {
      await Yup.string().label("Category").min(3).max(80).validate(value);
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

  return (
    <Select
      label="Category"
      id="category"
      onCreateOption={handleCreateOption}
      onChange={onChange}
      options={categories.map(({ category_id, name }) => ({ label: name, value: category_id }))}
      isLoading={createCategory.isLoading}
      isDisabled={createCategory.isLoading || isDisabled}
      isClearable
      {...props}
    />
  );
}

export default CategorySelect;
