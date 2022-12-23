import { editProductById, getProductById, toggleProductStatusById } from "@services/product";
import { getAllStocksByProductId } from "@services/stock";

import useMutation from "@hooks/mutation";
import useQuery from "@hooks/query";

function useProduct(id) {
  const payload = useQuery(["product", id], ({ signal }) => {
    return id ? getProductById(id, { signal }) : null;
  });
  const stocks = useQuery(["product", id, "stocks"], async ({ signal }) => {
    return id ? await getAllStocksByProductId(id, { signal }) : null;
  });

  const update = useMutation(async (body) => await editProductById(id, body));
  const toggleStatus = useMutation(toggleProductStatusById);

  return { payload, stocks, update, toggleStatus };
}

export default useProduct;
