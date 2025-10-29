"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Plus,
  Package,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AddNewBookButton from "@/components/AddNewBookButton";

interface NavbarProps {
  isSignedIn?: boolean;
}

export default function Navbar({ isSignedIn }: NavbarProps) {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const router = useRouter();

  // Use auth context if isSignedIn prop is not provided
  const userIsSignedIn = isSignedIn ?? isAuthenticated;

  // Book categories - Top 15 most popular
  const bookCategories = [
    { name: "Fiction", icon: "📚", slug: "fiction" },
    { name: "Mystery & Thriller", icon: "🔍", slug: "mystery" },
    { name: "Science Fiction", icon: "🚀", slug: "sci-fi" },
    { name: "Fantasy", icon: "🐉", slug: "fantasy" },
    { name: "Romance", icon: "💕", slug: "romance" },
    { name: "Horror", icon: "👻", slug: "horror" },
    { name: "Young Adult", icon: "🎓", slug: "young-adult" },
    { name: "Biography", icon: "👤", slug: "biography" },
    { name: "Self-Help", icon: "🌟", slug: "self-help" },
    { name: "Business", icon: "💼", slug: "business" },
    { name: "History", icon: "🏛️", slug: "history" },
    { name: "Cookbooks", icon: "👨‍🍳", slug: "cookbooks" },
    { name: "Travel", icon: "✈️", slug: "travel" },
    { name: "Technology", icon: "💻", slug: "technology" },
    { name: "Psychology", icon: "🧠", slug: "psychology" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <nav className="bg-black border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/book-browser" className="flex items-center">
          <span className="text-2xl font-bold text-white">
            Book<span className="text-teal-400">hub</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6">
          {/* Book Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-white hover:text-teal-400 hover:bg-gray-800 transition-colors"
              >
                Book Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="border-0 p-0 shadow-2xl overflow-hidden"
              style={{
                width: "1000px",
                maxHeight: "calc(100vh - 6rem)",
              }}
              align="center"
            >
              {/* Gradient Background Container - Inspired by SkySmile */}
              <div className="bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Explore Our Collection
                  </h3>
                  <p className="text-white/80 text-sm">
                    Discover your next great read from our curated categories
                  </p>
                </div>

                {/* Categories Grid - 5 columns, 3 rows */}
                <div className="grid grid-cols-5 gap-4">
                  {bookCategories.map((category, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      onSelect={() => {
                        handleNavigation(`/shop?category=${category.slug}`);
                      }}
                      className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all duration-300 group border border-white/20 hover:border-white/40 hover:scale-105 cursor-pointer"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {category.icon}
                      </span>
                      <span className="font-medium text-sm text-left group-hover:translate-x-1 transition-transform flex-1">
                        {category.name}
                      </span>
                      <svg
                        className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* View All Button */}
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => {
                      handleNavigation("/shop");
                    }}
                    className="bg-white text-teal-600 hover:bg-white/90 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    View All Books →
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search Bookhub by Title, Author or ISBN"
              className="w-80 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-teal-400"
            />
          </div>

          {/* Auth Section */}
          {userIsSignedIn ? (
            <div className="flex items-center space-x-4">
              {/* Role-based features */}
              {hasRole("SELLER", "ADMIN") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-teal-400 hover:bg-gray-800"
                  onClick={() => handleNavigation("/admin")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New Book
                </Button>
              )}

              {/* Shopping Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-teal-400 hover:bg-gray-800"
                onClick={() => handleNavigation("/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 text-white hover:text-teal-400 hover:bg-gray-800 px-3 py-2 rounded-md transition-colors cursor-pointer">
                  <Avatar className="h-8 w-8 bg-teal-400">
                    <AvatarFallback className="bg-teal-400 text-black text-sm font-medium">
                      {user?.firstName?.charAt(0) ||
                        user?.email?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-gray-900 border-gray-700 w-56 z-50"
                >
                  <div className="px-2 py-1.5 text-sm text-gray-400">
                    <div className="font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs">{user?.email}</div>
                    <div className="text-xs text-teal-400 capitalize">
                      {user?.role?.toLowerCase()}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    onSelect={() => handleNavigation("/dashboard")}
                    className="text-white hover:bg-gray-800 cursor-pointer"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>

                  {hasRole("BUYER", "SELLER", "ADMIN") && (
                    <DropdownMenuItem
                      onSelect={() => handleNavigation("/admin/orders")}
                      className="text-white hover:bg-gray-800 cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                  )}

                  {hasRole("SELLER", "ADMIN") && (
                    <DropdownMenuItem
                      onSelect={() => handleNavigation("/inventory")}
                      className="text-white hover:bg-gray-800 cursor-pointer"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Manage Books
                    </DropdownMenuItem>
                  )}

                  {hasRole("ADMIN") && (
                    <DropdownMenuItem
                      onSelect={() => handleNavigation("/admin/adminPanel")}
                      className="text-white hover:bg-gray-800 cursor-pointer"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="text-red-400 hover:bg-gray-800 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:text-teal-400 hover:bg-gray-800"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="ghost"
                  className="text-white hover:text-teal-400 hover:bg-gray-800"
                >
                  Signup
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-teal-400 hover:bg-gray-800"
                onClick={() => handleNavigation("/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
