import { createSupplier, getAllSuppliers } from "@services/supplier";

import useMutation from "@hooks/mutation";
import useQuery from "@hooks/query";

function useSuppliers() {
  const payload = useQuery("suppliers", getAllSuppliers);
  const create = useMutation(createSupplier);

  return { payload, create, invalidate: async () => await payload.invalidate() };
}

export default useSuppliers;
