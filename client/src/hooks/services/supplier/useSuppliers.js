import { getAllSuppliers } from "@services/supplier";

import useQuery from "@hooks/query";

function useSuppliers() {
  const payload = useQuery("suppliers", getAllSuppliers);

  return { payload, invalidate: async () => await payload.invalidate() };
}

export default useSuppliers;
