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
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const url = getApiUrl("/api/v1/auth/login");
      console.log("Login URL:", url);
      console.log("Login credentials:", credentials);
      
      const response = await fetch(url, {
        method: "POST",
        headers: getApiHeaders(false), // No auth needed for login
        body: JSON.stringify(credentials),
      });

      console.log("Login response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login error response:", errorData);
        throw new Error(errorData.error || "Login failed");
      }

      const data: AuthResponse = await response.json();
      console.log("Login response data:", data);

      // Store token and user data
      setToken(data.token);
      setUser(data.user);
      setTokenToStorage(data.token);
      setUserToStorage(data.user);
      
      console.log("Token and user stored. Token:", data.token?.substring(0, 50) + "...");
      console.log("User:", data.user);
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
      const response = await fetch(getApiUrl("/api/v1/auth/register"), {
        method: "POST",
        headers: getApiHeaders(false), // No auth needed for registration
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const authData: AuthResponse = await response.json();

      // Store token and user data (auto-login after registration)
      setToken(authData.token);
      setUser(authData.user);
      setTokenToStorage(authData.token);
      setUserToStorage(authData.user);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
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
