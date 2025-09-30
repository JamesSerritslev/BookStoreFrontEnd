"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ShoppingCart, Star } from "lucide-react"

const DUMMY_BOOKS = [
    {
        id: 1,
        title: "The Rizzonomicon",
        subtitle: "How to Up Your Game and NPC-Proof Your Life",
        author: "Chad Thundercock",
        price: 24.99,
        originalPrice: 29.99,
        rating: 4.5,
        reviews: 1247,
        category: "Self-Help",
        cover: "/orange-gaming-book-cover.jpg",
        inStock: true,
        featured: true,
    },
    {
        id: 2,
        title: "Sigma Grinset for Dummies",
        subtitle: "How to Start Your Own Successful Business",
        author: "Business Guru",
        price: 19.99,
        originalPrice: 24.99,
        rating: 4.2,
        reviews: 892,
        category: "Business",
        cover: "/blue-business-book-cover.jpg",
        inStock: true,
        featured: false,
    },
    {
        id: 3,
        title: "Improve Your Jawline",
        subtitle: "A Step-by-Step Guide",
        author: "Dr. Strong Jaw",
        price: 16.99,
        originalPrice: null,
        rating: 4.0,
        reviews: 543,
        category: "Health & Fitness",
        cover: "/red-fitness-book-cover.jpg",
        inStock: true,
        featured: true,
    },
    {
        id: 4,
        title: "Digital Marketing Mastery",
        subtitle: "From Zero to Hero in 30 Days",
        author: "Marketing Maven",
        price: 32.99,
        originalPrice: 39.99,
        rating: 4.7,
        reviews: 2156,
        category: "Marketing",
        cover: "/green-marketing-book-cover.jpg",
        inStock: true,
        featured: false,
    },
    {
        id: 5,
        title: "The Art of Procrastination",
        subtitle: "Why Doing Nothing Gets Everything Done",
        author: "Lazy Genius",
        price: 21.99,
        originalPrice: null,
        rating: 3.8,
        reviews: 678,
        category: "Psychology",
        cover: "/purple-psychology-book-cover.jpg",
        inStock: false,
        featured: false,
    },
    {
        id: 6,
        title: "Cooking for Gamers",
        subtitle: "Quick Meals Between Matches",
        author: "Chef Noob",
        price: 18.99,
        originalPrice: 22.99,
        rating: 4.3,
        reviews: 1034,
        category: "Cooking",
        cover: "/yellow-cooking-book-cover.jpg",
        inStock: true,
        featured: false,
    },
    {
        id: 7,
        title: "Cryptocurrency for Beginners",
        subtitle: "Understanding the Digital Gold Rush",
        author: "Crypto King",
        price: 27.99,
        originalPrice: 34.99,
        rating: 4.1,
        reviews: 1567,
        category: "Finance",
        cover: "/gold-finance-book-cover.jpg",
        inStock: true,
        featured: true,
    },
    {
        id: 8,
        title: "Mindfulness in the Digital Age",
        subtitle: "Finding Peace in a Connected World",
        author: "Zen Master",
        price: 23.99,
        originalPrice: null,
        rating: 4.6,
        reviews: 987,
        category: "Self-Help",
        cover: "/teal-mindfulness-book-cover.jpg",
        inStock: true,
        featured: false,
    },
]

const CATEGORIES = ["All", "Self-Help", "Business", "Health & Fitness", "Marketing", "Psychology", "Cooking", "Finance"]

export function ShopContent() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [sortBy, setSortBy] = useState("featured")

    const filteredAndSortedBooks = useMemo(() => {
        const filtered = DUMMY_BOOKS.filter((book) => {
            const matchesSearch =
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === "All" || book.category === selectedCategory
            return matchesSearch && matchesCategory
        })

        // Sort books
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.price - b.price
                case "price-high":
                    return b.price - a.price
                case "rating":
                    return b.rating - a.rating
                case "featured":
                default:
                    return b.featured ? 1 : -1
            }
        })

        return filtered
    }, [searchTerm, selectedCategory, sortBy])

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">Book Shop</h1>
                <p className="text-gray-400 mb-6">Discover your next great read from our collection</p>

                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search books, authors, or topics..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    >
                        {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>

                {/* Results count */}
                <p className="text-gray-400">
                    Showing {filteredAndSortedBooks.length} of {DUMMY_BOOKS.length} books
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedBooks.map((book) => (
                    <Card
                        key={book.id}
                        className="bg-gray-900 border-gray-700 hover:border-teal-500 transition-all duration-300 hover:scale-105 group"
                    >
                        <CardContent className="p-0">
                            {/* Book Cover */}
                            <div className="relative overflow-hidden rounded-t-lg">
                                <img
                                    src={book.cover || "/placeholder.svg"}
                                    alt={book.title}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {book.featured && <Badge className="absolute top-2 left-2 bg-teal-500 text-black">Featured</Badge>}
                                {!book.inStock && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <Badge variant="destructive">Out of Stock</Badge>
                                    </div>
                                )}
                            </div>

                            {/* Book Details */}
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{book.title}</h3>
                                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{book.subtitle}</p>
                                <p className="text-gray-500 text-sm mb-3">by {book.author}</p>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-3">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < Math.floor(book.rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-400">
                    {book.rating} ({book.reviews})
                  </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-teal-400">${book.price}</span>
                                        {book.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through">${book.originalPrice}</span>
                                        )}
                                    </div>
                                    {book.originalPrice && (
                                        <Badge variant="secondary" className="bg-red-900 text-red-200">
                                            Save ${(book.originalPrice - book.price).toFixed(2)}
                                        </Badge>
                                    )}
                                </div>

                                {/* Add to Cart Button */}
                                <Button
                                    className={`w-full ${
                                        book.inStock
                                            ? "bg-teal-500 hover:bg-teal-600 text-black"
                                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                    }`}
                                    disabled={!book.inStock}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    {book.inStock ? "Add to Cart" : "Out of Stock"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredAndSortedBooks.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Filter className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">No books found</h3>
                        <p>Try adjusting your search terms or filters</p>
                    </div>
                    <Button
                        onClick={() => {
                            setSearchTerm("")
                            setSelectedCategory("All")
                            setSortBy("featured")
                        }}
                        variant="outline"
                        className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-black"
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    )
}
