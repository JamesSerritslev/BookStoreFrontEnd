"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
import { useRef } from "react";
import { fetchAllBooks } from "@/lib/api";

interface NavbarProps {
  isSignedIn?: boolean;
}

export default function Navbar({ isSignedIn }: NavbarProps) {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Initialize search query from URL params if available
  useEffect(() => {
    const query = searchParams?.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to shop page with search query
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // If empty, just go to shop
      router.push("/shop");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Use auth context if isSignedIn prop is not provided
  const userIsSignedIn = isSignedIn ?? isAuthenticated;

  // Book categories - Top 15 most popular
  const bookCategories = [
    { name: "Crying In The Shower (Fiction)", icon: "🚿😭", slug: "fiction" },
    { name: "Unhinged Detectives (Mystery & Thriller)", icon: "🔍☕", slug: "mystery" },
    { name: "How To Get Rich Off Memecoins (Science Fiction)", icon: "🚀🤡", slug: "sci-fi" },
    { name: "Fantasy But Emotionally Damaged (Fantasy)", icon: "🐉💔", slug: "fantasy" },
    { name: "Romance For People With No Riz (Romance)", icon: "💕😬", slug: "romance" },
    { name: "Horror But It’s Just My Life (Horror)", icon: "👻📉", slug: "horror" },
    { name: "Young Adult, Old Trauma (Young Adult)", icon: "🎓😩", slug: "young-adult" },
    { name: "Influencer Biographies (Biography)", icon: "👤🤳", slug: "biography" },
    { name: "Self-Help For People Who Refuse Help (Self-Help)", icon: "🌟🙃", slug: "self-help" },
    { name: "Business Gurus And Scams (Business)", icon: "💼🤑", slug: "business" },
    { name: "History According To Reddit (History)", icon: "🏛️📱", slug: "history" },
    { name: "Cooking With Your GPU (Cookbooks)", icon: "👨‍🍳💻", slug: "cookbooks" },
    { name: "Traveling To Escape My Problems (Travel)", icon: "✈️💀", slug: "travel" },
    { name: "AI Will Take My Job (Technology)", icon: "💻🤖", slug: "technology" },
    { name: "Overthinking For Beginners (Psychology)", icon: "🧠💭", slug: "psychology" },
  ];


  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch all books on mount for search suggestions
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const books = await fetchAllBooks();
        setAllBooks(books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    loadBooks();
  }, []);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim() && allBooks.length > 0) {
      const query = searchQuery.toLowerCase().trim();
      const filtered = allBooks
        .filter((book: any) => {
          const title = (book.title || "").toLowerCase();
          const author = (book.author || "").toLowerCase();
          const isbn = (book.isbn || "").toLowerCase();
          return title.includes(query) || author.includes(query) || isbn.includes(query);
        })
        .slice(0, 8); // Show top 8 results
      setFilteredSuggestions(filtered);
      // Show suggestions if there are results and input is focused
      if (filtered.length > 0) {
        setShowSuggestions(true);
      }
    } else {
      setFilteredSuggestions([]);
      if (!searchQuery.trim()) {
        setShowSuggestions(false);
      }
    }
  }, [searchQuery, allBooks]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


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

          {/* Search Bar with Hover Suggestions */}
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Search Bookhub by Title, Author or ISBN"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (filteredSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="w-80 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-teal-400 pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-1 text-gray-400 hover:text-teal-400 transition-colors z-10"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Hover Dropdown Results */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-[100] top-full mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden max-h-96 overflow-y-auto">
                <ul className="py-1">
                  {filteredSuggestions.map((book: any, idx: number) => (
                    <li
                      key={book.bookId || book.id || idx}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        router.push(`/shop?q=${encodeURIComponent(book.title || "")}`);
                        setShowSuggestions(false);
                        setSearchQuery(book.title || "");
                      }}
                      className="px-4 py-3 text-white hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800 last:border-b-0"
                    >
                      <div className="font-medium">{book.title}</div>
                      {book.author && (
                        <div className="text-sm text-gray-400 mt-1">
                          by {book.author}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                      onSelect={() => handleNavigation("/admin/manageBooks")}
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
