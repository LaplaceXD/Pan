import { createOrder, getAllOrders } from "@services/order";

import useMutation from "@hooks/mutation";
import useQuery from "@hooks/query";

function useOrders() {
  const payload = useQuery("orders", getAllOrders);
  const create = useMutation(createOrder);

  return { payload, create, invalidate: async () => await payload.invalidate() };
}

export default useOrders;
