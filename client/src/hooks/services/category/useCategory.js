import { deleteCategoryById, editCategoryById } from "@services/category";

import useMutation from "@hooks/mutation";

function useCategory(id) {
  const remove = useMutation(async () => await deleteCategoryById(id));
  const update = useMutation(async (body) => await editCategoryById(id, body));

  return { delete: remove, update };
}

export default useCategory;
