import { deleteOrderById, getOrderById } from "@services/order";

import useMutation from "@hooks/mutation";
import useQuery from "@hooks/query";

function useOrder(id) {
  const payload = useQuery(["order", id], async ({ signal }) => {
    return id ? await getOrderById(id, { signal }) : null;
  });
  const remove = useMutation(async () => await deleteOrderById(id));

  return { payload, delete: remove, invalidate: async () => await payload.invalidate() };
}

export default useOrder;
