import { getAllEmployees } from "@services/employee.js";

import useQuery from "@hooks/query";

function useEmployees() {
  const payload = useQuery("employees", getAllEmployees);

  return { payload, invalidate: async () => await payload.invalidate() };
}

export default useEmployees;
