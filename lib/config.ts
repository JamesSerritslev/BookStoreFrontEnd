// API Configuration
// Backend team: Update these URLs to match your deployed backend endpoints

export const API_CONFIG = {
  // Base API URL - Backend team should update this
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register', 
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  
  // Protected endpoints
  BOOKS: '/books',
  CART: '/cart',
  ORDERS: '/orders',
  USERS: '/users',
  
  // Admin endpoints  
  ADMIN: {
    USERS: '/admin/users',
    ROLES: '/admin/roles'
  }
} as const;

// HTTP request helper with auth header
export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// API request wrapper with error handling
export const apiRequest = async (
  endpoint: string, 
  options: RequestInit = {},
  token?: string
) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(token),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};
