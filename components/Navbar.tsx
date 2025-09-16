"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ShoppingCart } from "lucide-react"

interface NavbarProps {
  isSignedIn?: boolean
}

export default function Navbar({ isSignedIn = false }: NavbarProps) {
  return (
    <nav className="bg-black border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-white">
            Book<span className="text-teal-400">hub</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6">
          {/* Book Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:text-teal-400 hover:bg-gray-800">
                Book Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 border-gray-700">
              <DropdownMenuItem className="text-white hover:bg-gray-800">Fiction</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800">Non-Fiction</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800">Science</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800">Technology</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800">Biography</DropdownMenuItem>
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
          {isSignedIn ? (
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8 bg-teal-400">
                <AvatarFallback className="bg-teal-400 text-black text-sm font-medium">U</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" className="text-white hover:text-teal-400 hover:bg-gray-800">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-teal-400 hover:bg-gray-800">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="ghost" className="text-white hover:text-teal-400 hover:bg-gray-800">
                  Signup
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="text-white hover:text-teal-400 hover:bg-gray-800">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
