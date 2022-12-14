import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "@hooks/auth";

function useQuery(query, checkAuth = true) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  function redirectIfUnauthorized(status) {
    if (status === 401) {
      auth.logout();
      toast.error("Session timeout.");
      navigate("/login");
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    (async function () {
      const { error, status, data } = await query(controller.signal);
      checkAuth && redirectIfUnauthorized(status);

      if (error) {
        setError(error);
      } else {
        setData(data);
      }
    })();

    return () => controller.abort();
  }, []);

  return { data, error, isLoading: !data, isError: !!error };
}

export default useQuery;
