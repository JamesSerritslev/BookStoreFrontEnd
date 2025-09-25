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
import { API_CONFIG, apiRequest } from "@/lib/config";

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

  // Login function - ready for backend integration
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Backend team - Replace this mock implementation with:
      // const response = await fetch('/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);
      // setToken(data.token); setUser(data.user); etc.

      // MOCK DATA - Remove when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // Mock authentication - replace with actual API response
      if (
        credentials.email === "admin@bookhub.com" &&
        credentials.password === "admin123"
      ) {
        const mockAuthResponse: AuthResponse = {
          token: "mock.jwt.token.admin",
          user: {
            id: 1,
            email: credentials.email,
            firstName: "Admin",
            lastName: "User",
            role: "ADMIN",
          },
        };

        setToken(mockAuthResponse.token);
        setUser(mockAuthResponse.user);
        setTokenToStorage(mockAuthResponse.token);
        setUserToStorage(mockAuthResponse.user);
        return; // Exit function after successful login
      } else if (
        credentials.email === "seller@bookhub.com" &&
        credentials.password === "seller123"
      ) {
        const mockAuthResponse: AuthResponse = {
          token: "mock.jwt.token.seller",
          user: {
            id: 2,
            email: credentials.email,
            firstName: "Seller",
            lastName: "User",
            role: "SELLER",
          },
        };

        setToken(mockAuthResponse.token);
        setUser(mockAuthResponse.user);
        setTokenToStorage(mockAuthResponse.token);
        setUserToStorage(mockAuthResponse.user);
        return; // Exit function after successful login
      } else if (
        credentials.email === "buyer@bookhub.com" &&
        credentials.password === "buyer123"
      ) {
        const mockAuthResponse: AuthResponse = {
          token: "mock.jwt.token.buyer",
          user: {
            id: 3,
            email: credentials.email,
            firstName: "Buyer",
            lastName: "User",
            role: "BUYER",
          },
        };

        setToken(mockAuthResponse.token);
        setUser(mockAuthResponse.user);
        setTokenToStorage(mockAuthResponse.token);
        setUserToStorage(mockAuthResponse.user);
        return; // Exit function after successful login
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - ready for backend integration
  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Backend team - Replace this mock implementation with:
      // const response = await fetch('/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // const authData = await response.json();
      // if (!response.ok) throw new Error(authData.message);
      // setToken(authData.token); setUser(authData.user); etc.

      // MOCK DATA - Remove when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // Mock registration - auto-login after successful registration
      const mockAuthResponse: AuthResponse = {
        token: "mock.jwt.token.newuser",
        user: {
          id: Math.floor(Math.random() * 1000) + 100, // Random ID
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role || "BUYER", // Default to BUYER
        },
      };

      setToken(mockAuthResponse.token);
      setUser(mockAuthResponse.user);
      setTokenToStorage(mockAuthResponse.token);
      setUserToStorage(mockAuthResponse.user);
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
