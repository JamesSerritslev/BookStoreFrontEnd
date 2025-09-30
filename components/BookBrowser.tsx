"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Static book data - structured for future database integration
const books = [
  {
        id: 1,
        title: "The Rizzonomicon",
        subtitle: "How to up your game and rizz-proof your life",
        cover: "/images/atmosphere-space-cosmo-nebula-outer-space-astronomy-supernova-astronomical-object-133048 (2).jpg",
        category: "Self-Help",
    },
    {
        id: 2,
        title: "Sigma Grinset for Dummies",
        subtitle: "How to start your own successful business",
        cover: "/images/difference.jpg",
        category: "Business",
    },
    {
        id: 3,
        title: "Improve Your Jawline",
        subtitle: "A step-by-step guide",
        cover: "/images/OIP.jpg",
        category: "Health & Fitness",
    },
    {
        id: 4,
        title: "Digital Marketing Mastery",
        subtitle: "From zero to hero in 30 days",
        cover: "/images/planet-mars-01 (2).jpg",
        category: "Marketing",

  },
]

export default function BookBrowser() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const booksPerView = 3

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + booksPerView >= books.length ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, books.length - booksPerView) : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const visibleBooks = books.slice(currentIndex, currentIndex + booksPerView)

  return (
    <div className="relative">
      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {visibleBooks.map((book) => (
          <div key={book.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors">
              <img
                src={book.cover || "/placeholder.svg"}
                alt={book.title}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>
            <div className="mt-3">
              <h3 className="font-semibold text-lg text-white group-hover:text-teal-400 transition-colors">
                {book.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1">{book.subtitle}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-teal-400/20 text-teal-400 text-xs rounded-full">
                {book.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="bg-gray-900 border-gray-700 hover:bg-gray-800 text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="bg-gray-900 border-gray-700 hover:bg-gray-800 text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: Math.ceil(books.length / booksPerView) }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              Math.floor(currentIndex / booksPerView) === index ? "bg-teal-400" : "bg-gray-600 hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
