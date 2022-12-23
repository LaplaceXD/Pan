import { createProduct, getAllProducts } from "@services/product";

import useMutation from "@hooks/mutation";
import useQuery from "@hooks/query";

function useProducts() {
  const payload = useQuery("products", getAllProducts);
  const create = useMutation(createProduct);

  return { payload, create, invalidate: async () => await payload.invalidate() };
}

export default useProducts;
