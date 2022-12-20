import { useMutation as useReactMutation } from "react-query";
import { redirect } from "react-router-dom";

import { useAuth } from "@hooks";
import { toast } from "react-toastify";

function useMutation(mutationFn, { checkAuth = true, ...options } = { checkAuth: true }) {
  const auth = useAuth();
  const mutation = useReactMutation(mutationFn, options);

  async function execute(values) {
    const retVal = { error: null, data: null, isRedirect: false };
    const response = await mutation.mutateAsync(values);

    if (response) {
      const { error, message, status, data } = response;
      if (checkAuth && (await redirectIfUnauthorized(status))) return { ...retVal, isRedirect: true };
      if (error) return { ...retVal, error: message };
      return { ...retVal, data };
    }

    return retVal;
  }

  async function redirectIfUnauthorized(status) {
    const unauthorized = status === 401;

    if (unauthorized) {
      await auth.logout();
      toast.error("Session timeout.");
      redirect("/login");
    }

    return unauthorized;
  }

  return { ...mutation, execute };
}

export default useMutation;
