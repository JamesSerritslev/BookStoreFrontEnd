"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Heart,
  ShoppingCart,
  User,
  Users,
  Package,
  TrendingUp,
  Settings,
  Plus,
} from "lucide-react";
import { AuthRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@/lib/jwt";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  return (
    <AuthRoute>
      <DashboardContent />
    </AuthRoute>
  );
}

function DashboardContent() {
  const { user, hasRole } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <WelcomeSection user={user} />
          <StatsCards user={user} hasRole={hasRole} />
          <DashboardSections hasRole={hasRole} router={router} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function WelcomeSection({ user }: { user: User | null }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">
        Welcome back, {user?.firstName}!
      </h1>
      <p className="text-gray-400">
        {user?.role === "ADMIN" && "Manage the entire BookHub platform"}
        {user?.role === "SELLER" && "Manage your inventory and track sales"}
        {user?.role === "BUYER" && "Discover and manage your favorite books"}
      </p>
    </div>
  );
}

function StatsCards({
  user,
  hasRole,
}: {
  user: User | null;
  hasRole: (...roles: string[]) => boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Buyer Stats */}
      {hasRole("BUYER", "SELLER", "ADMIN") && (
        <>
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                My Books
              </CardTitle>
              <BookOpen className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24</div>
              <p className="text-xs text-gray-400">Books in library</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Wishlist
              </CardTitle>
              <Heart className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-xs text-gray-400">Books saved</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Cart
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <p className="text-xs text-gray-400">Items in cart</p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Seller Stats */}
      {hasRole("SELLER", "ADMIN") && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Inventory
            </CardTitle>
            <Package className="h-4 w-4 text-teal-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">48</div>
            <p className="text-xs text-gray-400">Books in stock</p>
          </CardContent>
        </Card>
      )}

      {/* Admin Stats */}
      {hasRole("ADMIN") && (
        <>
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1,234</div>
              <p className="text-xs text-gray-400">Active users</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$12,345</div>
              <p className="text-xs text-gray-400">This month</p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Profile Card (Always shown) */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Profile
          </CardTitle>
          <User className="h-4 w-4 text-teal-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">100%</div>
          <p className="text-xs text-gray-400">Profile complete</p>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSections({
  hasRole,
  router,
}: {
  hasRole: (...roles: string[]) => boolean;
  router: any;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Activity - Available to all users */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription className="text-gray-400">
            Your latest interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hasRole("ADMIN") && (
              <>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Reviewed user reports</p>
                    <p className="text-gray-400 text-xs">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      Updated platform settings
                    </p>
                    <p className="text-gray-400 text-xs">3 hours ago</p>
                  </div>
                </div>
              </>
            )}
            {hasRole("SELLER", "ADMIN") && (
              <>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      Added new book to inventory
                    </p>
                    <p className="text-gray-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Processed 3 new orders</p>
                    <p className="text-gray-400 text-xs">4 hours ago</p>
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">
                  Added "The Great Gatsby" to wishlist
                </p>
                <p className="text-gray-400 text-xs">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">
                  Purchased "1984" by George Orwell
                </p>
                <p className="text-gray-400 text-xs">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Second Card - Role-based content */}
      {hasRole("ADMIN") && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Admin Controls</CardTitle>
            <CardDescription className="text-gray-400">
              Platform management tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Package className="h-4 w-4 mr-2" />
                Manage Inventory
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                <Settings className="h-4 w-4 mr-2" />
                Platform Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {hasRole("SELLER") && !hasRole("ADMIN") && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Seller Tools</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your books and sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
          <Link href="/admin">
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add New Book
            </Button>
          </Link>
   
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Package className="h-4 w-4 mr-2" />
                Manage Inventory
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Sales Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {hasRole("BUYER") && !hasRole("SELLER", "ADMIN") && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recommended for You</CardTitle>
            <CardDescription className="text-gray-400">
              Books you might enjoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Dune</p>
                  <p className="text-gray-400 text-xs">by Frank Herbert</p>
                </div>
                <Button
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-600 text-black"
                >
                  Add to Cart
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">The Hobbit</p>
                  <p className="text-gray-400 text-xs">by J.R.R. Tolkien</p>
                </div>
                <Button
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-600 text-black"
                >
                  Add to Cart
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">
                    Brave New World
                  </p>
                  <p className="text-gray-400 text-xs">by Aldous Huxley</p>
                </div>
                <Button
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-600 text-black"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
