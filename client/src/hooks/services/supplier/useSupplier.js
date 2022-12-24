import { useQueryClient } from "react-query";

import { getAllStocksBySupplierId } from "@services/stock";
import { editSupplierById, getSupplierById, toggleSupplierStatusById } from "@services/supplier";

import useMutation from "@hooks/mutation";
import useQuery from "@hooks/query";

function useSupplier(id) {
  const queryClient = useQueryClient();

  const payload = useQuery(["supplier", id], async ({ signal }) => {
    return id ? await getSupplierById(id, { signal }) : null;
  });

  const stocks = useQuery(["supplier", id, "stocks"], async ({ signal }) => {
    return id ? await getAllStocksBySupplierId(id, { signal }) : null;
  });

  const update = useMutation(async (body) => await editSupplierById(id, body));
  const toggleStatus = useMutation(async () => await toggleSupplierStatusById(id));

  return {
    payload,
    stocks,
    update,
    toggleStatus,
    invalidate: async (id) => {
      if (!id) return await Promise.all([payload.invalidate(), stocks.invalidate()]);

      return await Promise.all([
        queryClient.invalidateQueries(["supplier", id]),
        queryClient.invalidateQueries(["supplier", id, "stocks"]),
      ]);
    },
  };
}

export default useSupplier;
