import {
  editEmployeeById,
  getEmployeeById,
  resetEmployeePasswordById,
  toggleEmployeeStatusById,
} from "@services/employee.js";

import useMutation from "@hooks/mutation";
import useQuery from "@hooks/query";

function useEmployee(id) {
  const payload = useQuery(["employee", id], async ({ signal }) => {
    return id ? await getEmployeeById(id, { signal }) : null;
  });
  const update = useMutation(async (body) => await editEmployeeById(id, body));
  const resetPassword = useMutation(async () => await resetEmployeePasswordById(id));
  const toggleStatus = useMutation(async () => await toggleEmployeeStatusById(id));

  return {
    payload,
    update,
    resetPassword,
    toggleStatus,
    invalidate: async () => await payload.invalidate(),
  };
}

export default useEmployee;
