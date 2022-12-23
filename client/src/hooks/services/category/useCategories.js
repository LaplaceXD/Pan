import { createCategory, getAllCategories } from "@services/category";

import useMutation from "@hooks/mutation";
import useQuery from "@hooks/query";

function useCategories() {
  const payload = useQuery("categories", getAllCategories);
  const create = useMutation(createCategory);

  return { payload, create, invalidate: async () => await payload.invalidate() };
}

export default useCategories;
