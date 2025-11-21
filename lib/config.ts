/**
 * Configuration for API endpoints
 *
 * All API calls go to the backend URL
 * In development, MSW (Mock Service Worker) intercepts these calls
 * In production, they go to the real backend
 */

/**
 * Base API URL - defaults to localhost:8080 for development
 * MSW will intercept these calls in development mode
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Full API URL constructor
 * @param path - API path starting with /api/v1/...
 * @returns Full URL for fetch calls
 */
export function getApiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

/**
 * Common fetch options with headers
 */
export function getApiHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (includeAuth && typeof window !== "undefined") {
    const token = localStorage.getItem("bookhub_token"); // Match the key used in lib/jwt.ts
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * API fetch wrapper with consistent error handling
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(path);
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getApiHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP ${response.status}`
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
