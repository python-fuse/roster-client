import { APIService } from "@/services/api";
import type { User } from "@/types/definitions";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
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

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await APIService.register(credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await APIService.getCurrentUser();
    // Handle both direct User response and nested {message, user} response
    const data = response.data as any;
    return data.user || data;
  },

  logout: async (): Promise<void> => {
    // Call API logout to clear server-side session/cookie
    await APIService.logout();
  },
};
