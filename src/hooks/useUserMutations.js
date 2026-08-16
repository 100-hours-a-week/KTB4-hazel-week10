import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  changePasswordRequest,
  connectDiscordAccountRequest,
  deleteMyAccountRequest,
  updateMyInfoRequest,
  updateNotificationSettingsRequest,
} from "@/api/userApi.js";
import userQueries from "@/queryFactory/userQueries.js";

export function useUpdateMyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyInfoRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueries.meKeys(),
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePasswordRequest,
  });
}

export function useDeleteMyAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyAccountRequest,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationSettingsRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueries.notificationSettingsKeys(),
      });
    },
  });
}

export function useConnectDiscordAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, state }) =>
      connectDiscordAccountRequest(code, state),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueries.notificationSettingsKeys(),
      });
    },
  });
}
