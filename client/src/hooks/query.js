import { useQuery as useReactQuery, useQueryClient } from "react-query";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "@hooks";

function useQuery(key, query, { checkAuth = true, ...options } = { checkAuth: true }) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const queryDetails = useReactQuery(
    key,
    async ({ ...params }) => {
      const response = await query({ ...params });

      if (response) {
        const { error, message, status, data } = response;
        checkAuth && (await redirectIfUnauthorized(status));

        if (error) throw new Error(message);
        return data;
      }

      return null;
    },
    {
      // minutes * seconds * milliseconds
      cacheTime: options?.cacheTime ?? 5 * 60 * 1000,
      staleTime: options?.staleTime ?? 2 * 60 * 1000,
    }
  );

  async function redirectIfUnauthorized(status) {
    if (status === 401) {
      await auth.logout();
      toast.error("Session timeout.");
      redirect("/login");
    }
  }

  return { ...queryDetails, invalidate: () => queryClient.invalidateQueries(key) };
}

export default useQuery;
