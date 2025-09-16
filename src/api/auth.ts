import { APIService } from "@/services/api";
import type { User } from "@/types/definitions";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const AuthAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await APIService.login(
      credentials.email,
      credentials.password
    );
    return response.data as LoginResponse;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await APIService.getCurrentUser();
    return response.data;
  },
};
