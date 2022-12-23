import { createStock, deleteStockById, editStockById, getStockById } from "@services/stock";

import useMutation from "@hooks/mutation";
import useQuery from "@hooks/query";

function useStock(id) {
  const payload = useQuery(["stock", id], async ({ signal }) => {
    return id ? await getStockById(id, { signal }) : null;
  });
  const update = useMutation(async (body) => await editStockById(id, body));
  const create = useMutation(createStock);
  const remove = useMutation(async () => await deleteStockById(id));

  return { payload, update, create, delete: remove, invalidate: async () => await payload.invalidate() };
}

export default useStock;
