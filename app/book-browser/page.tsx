"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
  TrendingUp,
  Award,
  Flame,
} from "lucide-react";
import { addToCart } from "@/lib/api/cart";
import { useToast } from "@/hooks/use-toast";

// Featured books for hero carousel
const FEATURED_BOOKS = [
  {
    id: 1,
    title: "The Rizzonomicon",
    subtitle: "How to Up Your Game and NPC-Proof Your Life",
    author: "Chad Thundercock",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.5,
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=500&fit=crop",
    badge: "Bestseller",
  },
  {
    id: 7,
    title: "Cryptocurrency for Beginners",
    subtitle: "Understanding the Digital Gold Rush",
    author: "Crypto King",
    price: 27.99,
    originalPrice: 34.99,
    rating: 4.1,
    cover:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=500&fit=crop",
    badge: "Hot Deal",
  },
  {
    id: 8,
    title: "Mindfulness in the Digital Age",
    subtitle: "Finding Peace in a Connected World",
    author: "Zen Master",
    price: 23.99,
    rating: 4.6,
    cover:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&h=500&fit=crop",
    badge: "Editor's Pick",
  },
];

// All available books
const ALL_BOOKS = [
  {
    id: 1,
    title: "The Rizzonomicon",
    author: "Chad Thundercock",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.5,
    reviews: 1247,
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    category: "Self-Help",
    featured: true,
  },
  {
    id: 2,
    title: "Sigma Grinset for Dummies",
    author: "Business Guru",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.2,
    reviews: 892,
    cover:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
    category: "Business",
    featured: false,
  },
  {
    id: 3,
    title: "Improve Your Jawline",
    author: "Dr. Strong Jaw",
    price: 16.99,
    rating: 4.0,
    reviews: 543,
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    category: "Health & Fitness",
    featured: true,
  },
  {
    id: 4,
    title: "Digital Marketing Mastery",
    author: "Marketing Maven",
    price: 32.99,
    originalPrice: 39.99,
    rating: 4.7,
    reviews: 2156,
    cover:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
    category: "Marketing",
    featured: false,
  },
  {
    id: 6,
    title: "Cooking for Gamers",
    author: "Chef Noob",
    price: 18.99,
    originalPrice: 22.99,
    rating: 4.3,
    reviews: 1034,
    cover:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=600&fit=crop",
    category: "Cooking",
    featured: false,
  },
  {
    id: 7,
    title: "Cryptocurrency for Beginners",
    author: "Crypto King",
    price: 27.99,
    originalPrice: 34.99,
    rating: 4.1,
    reviews: 1567,
    cover:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=600&fit=crop",
    category: "Finance",
    featured: true,
  },
  {
    id: 8,
    title: "Mindfulness in the Digital Age",
    author: "Zen Master",
    price: 23.99,
    rating: 4.6,
    reviews: 987,
    cover:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&h=600&fit=crop",
    category: "Self-Help",
    featured: false,
  },
];

const CATEGORIES = [
  { name: "All Books", count: 100, icon: "📚" },
  { name: "Self-Help", count: 25, icon: "🧠" },
  { name: "Business", count: 18, icon: "💼" },
  { name: "Health & Fitness", count: 15, icon: "💪" },
  { name: "Marketing", count: 12, icon: "📊" },
  { name: "Finance", count: 20, icon: "💰" },
  { name: "Cooking", count: 10, icon: "🍳" },
];

export default function BookBrowserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All Books");
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % FEATURED_BOOKS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? FEATURED_BOOKS.length - 1 : prev - 1
    );
  };

  const handleAddToCart = async (bookId: number, bookTitle: string) => {
    try {
      setAddingToCart(bookId);
      const inventoryId = `00000000-0000-0000-0000-${String(bookId).padStart(
        12,
        "0"
      )}`;
      await addToCart(inventoryId, 1);

      toast({
        title: "Added to cart!",
        description: `"${bookTitle}" has been added to your cart.`,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add item to cart.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredBooks =
    selectedCategory === "All Books"
      ? ALL_BOOKS
      : ALL_BOOKS.filter((book) => book.category === selectedCategory);

  const featuredBooks = ALL_BOOKS.filter((book) => book.featured);
  const bestsellers = ALL_BOOKS.sort((a, b) => b.reviews - a.reviews).slice(
    0,
    4
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Carousel Section */}
        <section className="relative bg-gradient-to-b from-gray-900 to-black py-16 mb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative h-[580px] rounded-2xl overflow-hidden shadow-2xl">
              {/* Carousel Items */}
              <div
                className="relative h-full transition-all duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {FEATURED_BOOKS.map((book, idx) => (
                  <div
                    key={book.id}
                    className="absolute inset-0 w-full h-full"
                    style={{ left: `${idx * 100}%` }}
                  >
                    {/* Background Image with Overlay */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${book.cover})`,
                        filter: "blur(8px) brightness(0.4)",
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10 h-full flex items-center pb-16">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full px-12 py-8">
                        {/* Left: Book Image */}
                        <div className="flex items-center justify-center">
                          <div className="relative group">
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-72 h-[420px] object-cover rounded-xl shadow-2xl border-4 border-teal-400/30 transition-transform duration-300 group-hover:scale-105"
                            />
                            <Badge className="absolute -top-3 -right-3 bg-teal-500 text-black text-base px-5 py-2 rotate-12 shadow-lg font-bold z-10">
                              {book.badge}
                            </Badge>
                          </div>
                        </div>

                        {/* Right: Book Details */}
                        <div className="flex flex-col justify-center space-y-5">
                          <div>
                            <Badge className="bg-teal-500/20 text-teal-400 border border-teal-500/30 mb-4 px-4 py-1.5 text-sm font-medium">
                              Featured Book
                            </Badge>
                            <h2 className="text-5xl font-bold mb-3 text-white leading-tight">
                              {book.title}
                            </h2>
                            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
                              {book.subtitle}
                            </p>
                            <p className="text-lg text-gray-400">
                              by {book.author}
                            </p>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < Math.floor(book.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-lg font-semibold text-gray-200">
                              {book.rating}
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold text-teal-400">
                              ${book.price}
                            </span>
                            {book.originalPrice && (
                              <>
                                <span className="text-2xl text-gray-500 line-through">
                                  ${book.originalPrice}
                                </span>
                                <Badge className="bg-red-500 text-white px-3 py-1.5 text-sm font-semibold">
                                  Save $
                                  {(book.originalPrice - book.price).toFixed(2)}
                                </Badge>
                              </>
                            )}
                          </div>

                          {/* CTA Buttons */}
                          <div className="flex gap-4 pt-1">
                            <Button
                              size="lg"
                              className="bg-teal-500 hover:bg-teal-600 text-black font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                              onClick={() =>
                                handleAddToCart(book.id, book.title)
                              }
                              disabled={addingToCart === book.id}
                            >
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              {addingToCart === book.id
                                ? "Adding..."
                                : "Add to Cart"}
                            </Button>
                            <Button
                              size="lg"
                              variant="outline"
                              className="border-2 border-teal-500 text-teal-400 hover:bg-teal-500/20 px-8 py-6 text-lg font-semibold transition-all"
                              onClick={() => router.push("/shop")}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-teal-500 text-white p-4 rounded-full transition-all shadow-lg hover:scale-110"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-teal-500 text-white p-4 rounded-full transition-all shadow-lg hover:scale-110"
              >
                <ChevronRight className="w-7 h-7" />
              </button>

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {FEATURED_BOOKS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-3 rounded-full transition-all ${
                      currentSlide === idx
                        ? "w-12 bg-teal-400 shadow-lg shadow-teal-400/50"
                        : "w-3 bg-gray-500 hover:bg-gray-400 hover:w-6"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Left Sidebar - Categories */}
            <aside className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-700 sticky top-24 shadow-xl">
                <CardContent className="p-7">
                  <h3 className="text-2xl font-bold mb-7 flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    Categories
                  </h3>
                  <nav className="space-y-3">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full text-left px-5 py-4 rounded-xl transition-all font-medium ${
                          selectedCategory === category.name
                            ? "bg-teal-500 text-black font-bold shadow-lg shadow-teal-500/30 scale-105"
                            : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:scale-102"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-3">
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-base">{category.name}</span>
                          </span>
                          <span
                            className={`text-sm font-semibold ${
                              selectedCategory === category.name
                                ? "opacity-90"
                                : "opacity-60"
                            }`}
                          >
                            {category.count}
                          </span>
                        </div>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-16">
              {/* Bestsellers Section */}
              <section>
                <div className="flex items-center gap-4 mb-4">
                  <Flame className="w-10 h-10 text-orange-400" />
                  <h2 className="text-4xl font-bold">Bestsellers</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg">
                  Top picks loved by our readers
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                  {bestsellers.map((book) => (
                    <Card
                      key={book.id}
                      className="bg-gray-900 border-gray-700 hover:border-teal-500 transition-all group cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-teal-500/20"
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-orange-500 text-white px-3 py-1.5 shadow-lg font-semibold">
                              <TrendingUp className="w-4 h-4 mr-1.5" />
                              Hot
                            </Badge>
                          </div>
                        </div>
                        <div className="p-5 space-y-3">
                          <h3 className="font-bold text-xl line-clamp-1 group-hover:text-teal-400 transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            by {book.author}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(book.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                              ({book.reviews})
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-teal-400">
                              ${book.price}
                            </span>
                            {book.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${book.originalPrice}
                              </span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-teal-500 hover:bg-teal-600 text-black font-bold py-6 shadow-md hover:shadow-lg transition-all"
                            onClick={() => handleAddToCart(book.id, book.title)}
                            disabled={addingToCart === book.id}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {addingToCart === book.id
                              ? "Adding..."
                              : "Add to Cart"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Featured Books Section */}
              <section>
                <div className="flex items-center gap-4 mb-4">
                  <Award className="w-10 h-10 text-teal-400" />
                  <h2 className="text-4xl font-bold">Featured Books</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg">
                  Handpicked selections from our editors
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {featuredBooks.map((book) => (
                    <Card
                      key={book.id}
                      className="bg-gray-900 border-gray-700 hover:border-teal-500 transition-all group shadow-lg hover:shadow-2xl hover:shadow-teal-500/20"
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <Badge className="absolute top-4 left-4 bg-teal-500 text-black px-4 py-2 shadow-lg font-bold">
                            Featured
                          </Badge>
                        </div>
                        <div className="p-6 space-y-4">
                          <h3 className="font-bold text-2xl group-hover:text-teal-400 transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-base text-gray-400">
                            by {book.author}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < Math.floor(book.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-400 font-medium">
                              {book.rating} ({book.reviews})
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl font-bold text-teal-400">
                                ${book.price}
                              </span>
                              {book.originalPrice && (
                                <span className="text-base text-gray-500 line-through">
                                  ${book.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            className="w-full bg-teal-500 hover:bg-teal-600 text-black font-bold py-7 text-base shadow-md hover:shadow-lg transition-all"
                            onClick={() => handleAddToCart(book.id, book.title)}
                            disabled={addingToCart === book.id}
                          >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            {addingToCart === book.id
                              ? "Adding..."
                              : "Add to Cart"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* All Books Section (Filtered by Category) */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-4xl font-bold mb-3">
                      {selectedCategory}
                    </h2>
                    <p className="text-gray-400 text-lg">
                      Showing {filteredBooks.length} books
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-2 border-teal-500 text-teal-400 hover:bg-teal-500/20 px-6 py-6 text-base font-semibold transition-all"
                    onClick={() => router.push("/shop")}
                  >
                    View All Books →
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filteredBooks.slice(0, 6).map((book) => (
                    <Card
                      key={book.id}
                      className="bg-gray-900 border-gray-700 hover:border-teal-500 transition-all group"
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {book.featured && (
                            <Badge className="absolute top-2 left-2 bg-teal-500 text-black">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="p-4">
                          <span className="inline-block px-2 py-1 bg-teal-400/20 text-teal-400 text-xs rounded-full mb-2">
                            {book.category}
                          </span>
                          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-3">
                            by {book.author}
                          </p>
                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(book.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({book.reviews})
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xl font-bold text-teal-400">
                              ${book.price}
                            </span>
                            {book.originalPrice && (
                              <Badge className="bg-red-900 text-red-200 text-xs">
                                Save $
                                {(book.originalPrice - book.price).toFixed(2)}
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-teal-500 hover:bg-teal-600 text-black"
                            onClick={() => handleAddToCart(book.id, book.title)}
                            disabled={addingToCart === book.id}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredBooks.length > 6 && (
                  <div className="text-center mt-10">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-teal-500 text-teal-400 hover:bg-teal-500/20 px-10 py-7 text-lg font-semibold transition-all"
                      onClick={() => router.push("/shop")}
                    >
                      View All {selectedCategory} Books →
                    </Button>
                  </div>
                )}
              </section>

              {/* Special Offers Banner */}
              <section className="bg-gradient-to-r from-teal-900/40 to-blue-900/40 border-2 border-teal-500/40 rounded-2xl p-12 text-center shadow-2xl">
                <h2 className="text-5xl font-bold mb-5 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  Special Offers This Week
                </h2>
                <p className="text-gray-300 mb-8 text-xl leading-relaxed">
                  Save up to 40% on selected titles. Limited time offer!
                </p>
                <Button
                  size="lg"
                  className="bg-teal-500 hover:bg-teal-600 text-black font-bold px-12 py-7 text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  onClick={() => router.push("/shop")}
                >
                  Shop Deals Now →
                </Button>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
