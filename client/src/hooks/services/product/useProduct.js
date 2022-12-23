import { editProductById, getProductById, toggleProductStatusById } from "@services/product";
import { getAllStocksByProductId } from "@services/stock";

import useMutation from "@hooks/mutation";
import useQuery from "@hooks/query";

function useProduct(id) {
  const payload = useQuery(["product", id], async ({ signal }) => {
    return id ? await getProductById(id, { signal }) : null;
  });
  const stocks = useQuery(["product", id, "stocks"], async ({ signal }) => {
    return id ? await getAllStocksByProductId(id, { signal }) : null;
  });

  const update = useMutation(async (body) => await editProductById(id, body));
  const toggleStatus = useMutation(async () => await toggleProductStatusById(id));

  return {
    payload,
    stocks,
    update,
    toggleStatus,
    invalidate: async () => await Promise.all([payload.invalidate(), stocks.invalidate()]),
  };
}

export default useProduct;
