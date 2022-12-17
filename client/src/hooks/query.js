import { useQuery as useReactQuery } from "react-query";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "@hooks/auth";

function useQuery(key, query, { checkAuth = true, ...options } = { checkAuth: true }) {
  const auth = useAuth();
  const queryDetails = useReactQuery(
    key,
    async ({ ...params }) => {
      const { error, message, status, data } = await query({ ...params });
      checkAuth && (await redirectIfUnauthorized(status));

      if (error) throw new Error(message);
      return data;
    },
    options
  );

  async function redirectIfUnauthorized(status) {
    if (status === 401) {
      await auth.logout();
      toast.error("Session timeout.");
      redirect("/login");
    }
  }

  return queryDetails;
}

export default useQuery;
