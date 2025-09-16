import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, ShoppingCart, User } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar isSignedIn={true} />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
            <p className="text-gray-400">Manage your books and account settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">My Books</CardTitle>
                <BookOpen className="h-4 w-4 text-teal-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">24</div>
                <p className="text-xs text-gray-400">Books in library</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Wishlist</CardTitle>
                <Heart className="h-4 w-4 text-teal-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">12</div>
                <p className="text-xs text-gray-400">Books saved</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Cart</CardTitle>
                <ShoppingCart className="h-4 w-4 text-teal-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">3</div>
                <p className="text-xs text-gray-400">Items in cart</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Profile</CardTitle>
                <User className="h-4 w-4 text-teal-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">100%</div>
                <p className="text-xs text-gray-400">Profile complete</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">Your latest book interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">Added "The Great Gatsby" to wishlist</p>
                      <p className="text-gray-400 text-xs">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">Purchased "1984" by George Orwell</p>
                      <p className="text-gray-400 text-xs">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">Left a review for "To Kill a Mockingbird"</p>
                      <p className="text-gray-400 text-xs">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recommended for You</CardTitle>
                <CardDescription className="text-gray-400">Books you might enjoy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">Dune</p>
                      <p className="text-gray-400 text-xs">by Frank Herbert</p>
                    </div>
                    <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-black">
                      Add to Cart
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">The Hobbit</p>
                      <p className="text-gray-400 text-xs">by J.R.R. Tolkien</p>
                    </div>
                    <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-black">
                      Add to Cart
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">Brave New World</p>
                      <p className="text-gray-400 text-xs">by Aldous Huxley</p>
                    </div>
                    <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-black">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
