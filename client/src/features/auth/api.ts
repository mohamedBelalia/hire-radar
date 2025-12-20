import { getToken, removeToken, setToken } from "@/lib";
import apiClient from "@/lib/apiClient";
import type {
  ISignupRequest,
  ISignupResponse,
  LoginResponse,
} from "@/types/authResponseTypes";

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<LoginResponse>("/api/auth/login", {
    email,
    password,
  });

  setToken(data.token);
  return data;
}

export async function signup(userData: ISignupRequest) {
  const { data } = await apiClient.post<ISignupResponse>("/api/auth/signup", {
    ...userData,
  });

  setToken(data.token);
  return data;
}

export const oAuth = async () => {
  const response = await apiClient.get(`/api/auth/google`);
  return response;
};

export const me = async (token?: string) => {
  try {
    const response = await apiClient.get("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token || getToken()}`,
      },
    });
    return response.data;
  } catch (err) {
    return null;
  }
};

export const logout = async () => {
  removeToken();
  return true;
};

export const githubConnect = async () => {
  const { data } = await apiClient.get<{ auth_url: string }>(
    "/api/oauth/github/connect",
  );
  return data;
};

export const getConnectedAccounts = async () => {
  const { data } = await apiClient.get<{
    connected_accounts: Array<{
      provider: string;
      username?: string;
      connected: boolean;
    }>;
  }>("/api/auth/me/connected-accounts");
  return data;
};
