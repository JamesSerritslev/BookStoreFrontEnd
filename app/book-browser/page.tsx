"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { addToCart } from "@/lib/api/cart";
import { getAllBooks, type Book } from "@/lib/api/books";
import { useToast } from "@/hooks/use-toast";

// Helper function to map API books to UI format
const mapBookToUIFormat = (book: Book, index: number) => {
  const categories = [
    "Self-Help",
    "Business",
    "Health & Fitness",
    "Marketing",
    "Cooking",
    "Finance",
  ];
  const authors = [
    "Chad Thundercock",
    "Business Guru",
    "Dr. Strong Jaw",
    "Marketing Maven",
    "Chef Noob",
    "Crypto King",
    "Zen Master",
  ];

  return {
    id: book.bookId,
    title: book.bookName,
    author: authors[index % authors.length],
    price: book.bookPrice,
    originalPrice: book.bookPrice > 20 ? book.bookPrice + 5 : undefined,
    rating: 4 + Math.random() * 0.9, // Random rating 4.0-4.9
    reviews: Math.floor(Math.random() * 2000) + 500,
    cover: book.bookPicture,
    category: categories[index % categories.length],
    featured: index % 3 === 0, // Every 3rd book is featured
    description: book.bookDescription,
  };
};

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
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch books from API
  useEffect(() => {
    async function fetchBooks() {
      try {
        setIsLoading(true);
        const apiBooks = await getAllBooks();
        const mappedBooks = apiBooks.map((book, index) =>
          mapBookToUIFormat(book, index)
        );
        setBooks(mappedBooks);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        toast({
          title: "Error",
          description: "Failed to load books. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchBooks();
  }, [toast]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(featuredBooks.length, 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.max(featuredBooks.length - 1, 0) : prev - 1
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

  // Derived data from fetched books
  const filteredBooks =
    selectedCategory === "All Books"
      ? books
      : books.filter((book) => book.category === selectedCategory);

  const featuredBooks = books.filter((book) => book.featured).slice(0, 3);
  const bestsellers = [...books]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 4);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-teal-400 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Loading amazing books...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                {featuredBooks.map((book, idx) => (
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
                {featuredBooks.map((_, idx) => (
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
