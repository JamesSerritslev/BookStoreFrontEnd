"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  getTokenFromStorage,
  getUserFromStorage,
  setTokenToStorage,
  setUserToStorage,
  clearAuthStorage,
  isTokenValid,
  hasAnyRole,
} from "@/lib/jwt";
import { getApiUrl, getApiHeaders } from "@/lib/config";

interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;

  // Utility functions
  hasRole: (...roles: string[]) => boolean;
  isAdmin: () => boolean;
  isSeller: () => boolean;
  isBuyer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = getTokenFromStorage();
        const storedUser = getUserFromStorage();

        if (storedToken && isTokenValid(storedToken) && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        } else {
          // Clear invalid/expired data
          clearAuthStorage();
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        clearAuthStorage();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function - Uses real API
  // Login function - Uses real API, but allows dev fallback
const login = async (credentials: LoginCredentials): Promise<void> => {
  setIsLoading(true);
  setError(null);

  try {
    // 🔹 DEV MODE ONLY — Hardcoded admin login
    if (
      process.env.NEXT_PUBLIC_ENV === "dev" &&
      credentials.email === "admin@bookhub.com" &&
      credentials.password === "admin123"
    ) {
      const fakeUser: User = {
        id: "dev-admin-1",
        firstName: "Dev",   // make sure firstName exists if dashboard uses it
        lastName: "Admin",
        name: "Dev Admin",
        email: "admin@dev.com",
        role: "ADMIN",
      };

      const fakeToken = "dev-token-123";

      setUser(fakeUser);
      setToken(fakeToken);
      setUserToStorage(fakeUser);
      setTokenToStorage(fakeToken);

      setIsLoading(false);
      return; // skip real API
    }

    // 🔹 REAL API LOGIN
    const response = await fetch(getApiUrl("/api/v1/auth/login"), {
      method: "POST",
      headers: getApiHeaders(false),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Login failed");
    }

    const data: AuthResponse = await response.json();

    setToken(data.token);
    setUser(data.user);
    setTokenToStorage(data.token);
    setUserToStorage(data.user);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Login failed";
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};


  // Register function - Uses real API
const register = async (data: RegisterData): Promise<void> => {
  setIsLoading(true);
  setError(null);

  try {
    // 🔹 ALWAYS call the real API, even in development
    const response = await fetch(getApiUrl("/api/v1/auth/register"), {
      method: "POST",
      headers: getApiHeaders(false),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Registration failed");
    }

    const authData: AuthResponse = await response.json();

    setToken(authData.token);
    setUser(authData.user);
    setTokenToStorage(authData.token);
    setUserToStorage(authData.user);

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Registration failed";
    setError(msg);
    throw new Error(msg);
  } finally {
    setIsLoading(false);
  }
};



  // Logout function
  const logout = (): void => {
    setUser(null);
    setToken(null);
    setError(null);
    clearAuthStorage();
  };

  // Clear error function
  const clearError = (): void => {
    setError(null);
  };

  // Utility functions
  const hasRole = (...roles: string[]): boolean => {
    if (!user) return false;
    return hasAnyRole(user.role, ...roles);
  };

  const isAdmin = (): boolean => hasRole("ADMIN");
  const isSeller = (): boolean => hasRole("SELLER");
  const isBuyer = (): boolean => hasRole("BUYER");

  const isAuthenticated = !!(user && token && isTokenValid(token));

  const value: AuthContextType = {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    clearError,

    // Utility functions
    hasRole,
    isAdmin,
    isSeller,
    isBuyer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
