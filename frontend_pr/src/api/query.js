import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApiRequests from "./api";

export const ApiQueries = {
  useGetUsers: () =>
    useQuery({
      queryKey: ["users"],
      queryFn: async () => ApiRequests.getUsers(),
      refetchOnWindowFocus: false,
    }),
  useGetNotifications: () =>
    useQuery({
      queryKey: ["notifications", "users"],
      queryFn: async () => ApiRequests.getNotifications(),
      refetchOnWindowFocus: false,
    }),
  useGetNewNotification: ({ id }) =>
    useQuery({
      queryKey: ["notifications"],
      queryFn: async () => ApiRequests.getNewNotification({ id }),
      refetchOnWindowFocus: false,
      enabled:!!id,
    }),
  useGetRequests: () =>
    useQuery({
      queryKey: ["requests"],
      queryFn: async () => ApiRequests.getRequests(),
      refetchOnWindowFocus: false,
    }),
  useGetRequestsById: (id) =>
    useQuery({
      queryKey: ["requests", id],
      queryFn: async () => ApiRequests.getRequestById(id),
      refetchOnWindowFocus: false,
    }),
};

export const ApiMutations = {
  useGetLogin: () => {
    return useMutation({
      mutationFn: async ({ payload }) => ApiRequests.getLogin({ payload }),
    });
  },
  useGetSignup: () => {
    return useMutation({
      mutationFn: async ({ payload }) => ApiRequests.getSignup({ payload }),
    });
  },
  useUpdateLastCheckTime: () => {
    const queryClient = useQueryClient();
    const queryKey = ["userById"];

    return useMutation({
      mutationFn: async ({ id, payload }) =>
        ApiRequests.updateLastCheckTime({ id, payload }),
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
      },
    });
  },
  useCreateRequest: () => {
    const queryClient = useQueryClient();
    const queryKey = ["requests"];

    return useMutation({
      mutationFn: async ({ payload }) => ApiRequests.createRequest({ payload }),
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
      },
    });
  },
  useUpdateNotificationStatus: () => {
    const queryClient = useQueryClient();
    const queryKeys = ["notifications"];

    return useMutation({
      mutationFn: async ({ id }) =>
        ApiRequests.updateNotificationStatus({ id }),
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys);
      },
    });
  },
  useDeleteRequestById: () => {
    const queryClient = useQueryClient();
    const queryKeys = ["requests"];

    return useMutation({
      mutationFn: async ({ id }) => ApiRequests.deleteRequestById({ id }),
      onSuccess: () => {
        queryKeys.forEach((key) => queryClient.invalidateQueries(key));
      },
    });
  },
  useUpdateRequestById: () => {
    const queryClient = useQueryClient();
    const queryKeys = ["requests"];

    return useMutation({
      mutationFn: async ({ id, payload }) =>
        ApiRequests.updateRequestById({ id, payload }),
      onSuccess: () => {
        queryKeys.forEach((key) => queryClient.invalidateQueries(key));
      },
    });
  },
  usePostCommentToRequestById: () => {
    const queryClient = useQueryClient();
    const queryKeys = ["comments"];

    return useMutation({
      mutationFn: async ({ id, payload }) =>
        ApiRequests.postCommentToRequestById({ id, payload }),
      onSuccess: () => {
        queryKeys.forEach((key) => queryClient.invalidateQueries(key));
      },
    });
  },
  usePostApprovalToRequestById: () => {
    const queryClient = useQueryClient();
    const queryKeys = ["approvals"];

    return useMutation({
      mutationFn: async ({ id, payload }) =>
        ApiRequests.postApprovalToRequestById({ id, payload }),
      onSuccess: () => {
        queryKeys.forEach((key) => queryClient.invalidateQueries(key));
      },
    });
  },
};
