import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "@hooks/auth";

function useQuery(query, checkAuth = true) {
  const auth = useAuth();
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
      const { error, message, status, data } = await query(controller.signal);
      checkAuth && (await redirectIfUnauthorized(status));

      if (error) {
        setError(message);
      } else {
        setData(data);
      }
    })();

    return () => controller.abort();
  }, []);

  return { data, error, isLoading: !data, isError: !!error };
}

export default useQuery;
