import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userDataService, type UserData } from "@/services/userData.service";

/**
 * Query hook to get user data from localStorage
 */
export function useUserData() {
  return useQuery<UserData | null>({
    queryKey: ["userData"],
    queryFn: () => userDataService.getUserData(),
    staleTime: Infinity, // localStorage-based, so never stale
    retry: false,
  });
}

/**
 * Mutation hook to update user data
 */
export function useUpdateUserData() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UserData>({
    mutationFn: (data) => {
      userDataService.setUserData(data);
      return Promise.resolve();
    },
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["userData"] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<UserData | null>(["userData"]);

      // Optimistically update cache
      queryClient.setQueryData<UserData | null>(["userData"], newData);

      return { previousData };
    },
    onError: (_err, _newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["userData"], context.previousData);
      }
    },
    onSuccess: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      // Dispatch custom event for backward compatibility
      window.dispatchEvent(new Event("onboarding-complete"));
    },
  });
}

/**
 * Mutation hook to clear user data
 */
export function useClearUserData() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => {
      userDataService.clearUserData();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear query cache
      queryClient.setQueryData(["userData"], null);
      // Dispatch custom event for backward compatibility
      window.dispatchEvent(new Event("onboarding-complete"));
    },
  });
}

