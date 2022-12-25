import { createEmployee, getAllEmployees } from "@services/employee.js";

import useMutation from "@hooks/mutation";
import useQuery from "@hooks/query";

function useEmployees() {
  const payload = useQuery("employees", getAllEmployees);
  const create = useMutation(createEmployee);

  return { payload, create, invalidate: async () => await payload.invalidate() };
}

export default useEmployees;
