import React, { useContext, createContext, useReducer, useEffect } from "react";
import { AuthAPI } from "@/api/auth";
import type { User } from "@/types/definitions";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  isLoading: boolean;
}

type AuthAction = {
  type: "LOGIN" | "LOGOUT" | "SET_USER" | "SET_ERROR" | "SET_LOADING";
  payload?: User | string | boolean | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: true, // Start with loading true
};

const AuthContext = createContext<
  { state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined
>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true, error: null, isLoading: false };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
        isLoading: false,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload as User,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload as string, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload as boolean };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to get current user with existing session cookie
        const user = await AuthAPI.getCurrentUser();
        dispatch({ type: "SET_USER", payload: user });
      } catch (error) {
        // No valid session, just set loading to false
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
