import { useMutation, useQuery } from "@tanstack/react-query";
import { login, me, signup } from "./api";
import { User } from "@/types";

/**
 * Creates a mutation hook that performs user login using email and password.
 *
 * @returns A React Query mutation object configured to call `login(email, password)`.
 */
export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: (userData: ISignupRequest) => signup(userData),
  });
}

export function useCurrentUser(token?: string) {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: () => me(token),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}