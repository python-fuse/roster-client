import React, { useContext, createContext, useReducer } from "react";

import type { User } from "@/types/definitions";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

type AuthAction = {
  type: "LOGIN" | "LOGOUT" | "SET_USER" | "SET_ERROR";
  payload?: User | string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
};

const AuthContext = createContext<
  { state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined
>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true, error: null };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, user: null, error: null };
    case "SET_USER":
      return { ...state, user: action.payload as User, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload as string };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

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
