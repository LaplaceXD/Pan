import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "@hooks/auth";

function useQuery(query, checkAuth = true) {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function redirectIfUnauthorized(status) {
    if (status === 401) {
      await auth.logout();
      toast.error("Session timeout.");
      redirect("/login");
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    (async function () {
      const response = await query(controller.signal);

      if (response) {
        const { error, message, status, data } = response;
        checkAuth && (await redirectIfUnauthorized(status));

        if (error) {
          setError(message);
        } else {
          setData(data);
        }
      }

      setIsLoading(false);
    })();

    return () => controller.abort();
  }, [query, setError, setData, setIsLoading]);

  return { data, error, isLoading, isError: !!error };
}

export default useQuery;
