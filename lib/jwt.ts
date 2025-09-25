// JWT utility functions for frontend authentication

export interface JWTPayload {
  userId: number;
  email: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "BUYER" | "SELLER" | "ADMIN";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: "BUYER" | "SELLER"; // Admin assigns roles, so only BUYER/SELLER for registration
}

// Decode JWT token to extract payload
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (middle part)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

// Check if JWT token is expired
export function isTokenExpired(token: string): boolean {
  // Handle mock tokens for development
  if (token.startsWith("mock.jwt.token.")) {
    return false; // Mock tokens never expire
  }

  const payload = decodeJWT(token);
  if (!payload) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

// Check if token is valid (exists and not expired)
export function isTokenValid(token: string | null): boolean {
  if (!token) {
    return false;
  }

  // Handle mock tokens for development
  if (token.startsWith("mock.jwt.token.")) {
    return true; // Mock tokens are always valid
  }

  return !isTokenExpired(token);
}

// Extract user data from JWT token
export function getUserFromToken(token: string): User | null {
  // Handle mock tokens for development
  if (token.startsWith("mock.jwt.token.")) {
    // For mock tokens, we'll return null since user data is stored separately
    // The AuthContext handles mock user data directly
    return null;
  }

  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  return {
    id: payload.userId,
    email: payload.email,
    firstName: "", // These will be filled from API response
    lastName: "",
    role: payload.role,
  };
}

// Local storage keys
const TOKEN_KEY = "bookhub_token";
const USER_KEY = "bookhub_user";

// Store token in localStorage
export function setTokenToStorage(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Failed to store token:", error);
  }
}

// Retrieve token from localStorage
export function getTokenFromStorage(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Failed to retrieve token:", error);
    return null;
  }
}

// Store user data in localStorage
export function setUserToStorage(user: User): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store user:", error);
  }
}

// Retrieve user data from localStorage
export function getUserFromStorage(): User | null {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    return null;
  }
}

// Clear all auth data from localStorage
export function clearAuthStorage(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Failed to clear auth storage:", error);
  }
}

// Check if user has specific role
export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}

// Check if user has any of the specified roles
export function hasAnyRole(userRole: string, ...roles: string[]): boolean {
  return roles.includes(userRole);
}
