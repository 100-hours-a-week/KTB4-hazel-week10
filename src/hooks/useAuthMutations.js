import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loginRequest, logoutRequest, signupRequest } from "@/api/authApi.js";

export function useLogin() {
  return useMutation({
    mutationFn: loginRequest,
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: signupRequest,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
