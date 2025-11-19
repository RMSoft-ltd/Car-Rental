import { useQueryClient } from "@tanstack/react-query";
import {
  useConfidentialInfoMutation,
  useUserDetailsQuery,
} from "./use-user";

export function useUserConfidentialInfo(userId?: number) {
  const queryClient = useQueryClient();
  const query = useUserDetailsQuery(userId);

  const mutation = useConfidentialInfoMutation(userId, {
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["userDetails", userId] });
      }
    },
  });

  return {
    query,
    mutation,
    data: query.data,
    user: query.data?.user ?? null,
    confidentialInfo: query.data?.confidentialInfo ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    isPending: mutation.isPending,
    updateConfidentialInfo: mutation.mutate,
    updateConfidentialInfoAsync: mutation.mutateAsync,
  };
}