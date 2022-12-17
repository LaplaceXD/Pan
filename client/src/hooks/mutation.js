import { useAuth } from "@hooks";
import { useMutation as useReactMutation } from "react-query";

function useMutation(mutationFn, { checkAuth = true, ...options } = { checkAuth: true }) {
  const auth = useAuth();
  const mutation = useReactMutation(mutationFn, options);

  async function execute(values) {
    const response = await mutation.mutateAsync(values);

    if (response) {
      const { error, message, status, data } = response;
      checkAuth && (await redirectIfUnauthorized(status));

      if (error) throw new Error(message);
      return data;
    }

    return null;
  }

  async function redirectIfUnauthorized(status) {
    if (status === 401) {
      await auth.logout();
      toast.error("Session timeout.");
      redirect("/login");
    }
  }

  return { ...mutation, execute };
}

export default useMutation;
