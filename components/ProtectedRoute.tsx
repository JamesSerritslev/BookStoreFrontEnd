"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // If not provided, just requires authentication
  redirectTo?: string; // Where to redirect if not authorized
  requireAuth?: boolean; // Default true
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access
    if (allowedRoles && user) {
      const hasRequiredRole = allowedRoles.includes(user.role);
      if (!hasRequiredRole) {
        // Redirect based on user's role or to unauthorized page
        if (user.role === "BUYER") {
          router.push("/dashboard"); // Buyers go to their dashboard
        } else if (user.role === "SELLER") {
          router.push("/dashboard"); // Sellers go to their dashboard
        } else {
          router.push("/unauthorized"); // Create this page for better UX
        }
        return;
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    allowedRoles,
    router,
    redirectTo,
    requireAuth,
  ]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Don't render if user doesn't have required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  // Render the protected content
  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminRoute({
  children,
  redirectTo,
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]} redirectTo={redirectTo}>
      {children}
    </ProtectedRoute>
  );
}

export function SellerRoute({
  children,
  redirectTo,
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  return (
    <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]} redirectTo={redirectTo}>
      {children}
    </ProtectedRoute>
  );
}

export function BuyerRoute({
  children,
  redirectTo,
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["BUYER", "SELLER", "ADMIN"]}
      redirectTo={redirectTo}
    >
      {children}
    </ProtectedRoute>
  );
}

// Auth-only route (any authenticated user)
export function AuthRoute({
  children,
  redirectTo,
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  return <ProtectedRoute redirectTo={redirectTo}>{children}</ProtectedRoute>;
}
