import { changeEmployeePasswordById, editEmployeeById, getEmployeeById } from "@services/employee";

import useMutation from "@hooks/mutation";
import useQuery from "@hooks/query";

function useAccount(id) {
  const payload = useQuery(["account", id], async ({ signal }) => {
    return id ? await getEmployeeById(id, { signal }) : null;
  });
  const changePassword = useMutation(async (body) => await changeEmployeePasswordById(id, body));
  const update = useMutation(async (body) => await editEmployeeById(id, body));

  return { payload, update, changePassword, invalidate: async () => await payload.invalidate() };
}

export default useAccount;
