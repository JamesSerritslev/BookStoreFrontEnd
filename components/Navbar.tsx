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
  
  // Number of columns for the Book Categories dropdown.
  // Set to 2 or 3 depending on how many columns you want.
  const CATEGORY_COLUMNS = 3;
  const CATEGORY_COL_WIDTH_REM = 10; // width of each column in rem
  const DROPDOWN_PADDING_REM = 1; // left+right padding (approx)
  const dropdownWidth = `${CATEGORY_COLUMNS * CATEGORY_COL_WIDTH_REM + DROPDOWN_PADDING_REM}rem`;
  const gridTemplateColumns = `repeat(${CATEGORY_COLUMNS}, ${CATEGORY_COL_WIDTH_REM}rem)`;
  // Margin-left to roughly center the left-most column under the trigger.
  const leftOffset = `calc(50% - ${CATEGORY_COL_WIDTH_REM / 2}rem)`;
  // Use auth context if isSignedIn prop is not provided
  const userIsSignedIn = isSignedIn ?? isAuthenticated;

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
                className="text-white hover:text-teal-400 hover:bg-gray-800"
              >
                Book Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-gray-900 border-gray-700 p-2"
              style={{
                marginLeft: leftOffset,
                width: dropdownWidth,
                // Keep dropdown within the viewport; only scroll internally when it exceeds available height
                maxHeight: "calc(100vh - 6rem)",
                overflowY: "auto",
              }}
            >
              <div className="grid gap-1" style={{ gridTemplateColumns }}>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Sad People’s Autobiographies (Biography & Memoir)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Crystal Moms & Vibe Checks (Body, Mind, & Spirit)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Capitalism 101 (Business)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Baby’s First Existential Crisis (Children's)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Hackerman Stuff (Computer & Technology)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  How to Burn Water (Cookbooks & Wine)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Glue & Glitter Addicts (Crafts & Hobbies)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Debt & Student Tears (Education)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  It’s Complicated (Family & Relationships)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Fake Stuff (Fiction)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Gym Bros & Salad (Health & Fitness)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Old Dead People (History)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  HGTV Dreams (Home & Garden)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Nightmares on Paper (Horror)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Japanese Cartoon Books (Manga & Graphic Novels)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Doctor’s Homework (Medical & Nursing)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Airport Dad Reads (Mystery & Thrillers)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Supposedly True Stuff (Non-Fiction)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Sad Rhymes (Poetry)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Arguing About Gov’t (Political Science)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Brain Hurts (Psychology)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Sky Daddy Books (Religion)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Kissing Simulator (Romance)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Space Wizards (Science Fiction)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Fix Yo Self (Self Help)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Overthinking Everything (Social Science)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Extreme Frisbee Majors (Sports & Recreation)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Escaping Ohio (Travel)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Netflix but in Print (True Crime)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Angst & Acne (Young Adult)
                </DropdownMenuItem>
                {/* Add empty placeholders if you want equal cells, or let grid auto-fill */}
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
