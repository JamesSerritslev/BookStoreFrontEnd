"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  Book,
} from "@/lib/api/books";

export default function AddBookPage() {
  const router = useRouter();
  const { isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated or not seller/admin
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    } else if (!authLoading && !hasRole("SELLER", "ADMIN")) {
      router.replace("/dashboard"); // Redirect to dashboard if not authorized
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  // Fetch books from API
  useEffect(() => {
    async function fetchBooks() {
      if (!isAuthenticated) return;

      try {
        setIsFetching(true);
        setError(null);
        const fetchedBooks = await getAllBooks();
        setBooks(fetchedBooks);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError(err instanceof Error ? err.message : "Failed to load books");
      } finally {
        setIsFetching(false);
      }
    }

    fetchBooks();
  }, [isAuthenticated]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-teal-400" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Don't render if not authenticated or not authorized
  if (!isAuthenticated || !hasRole("SELLER", "ADMIN")) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Determine which image source to use
      const imageSource = imageFile ? imagePreview : image;

      if (editingId !== null) {
        // Update existing book
        const updatedBook = await updateBook(editingId, {
          bookName: title,
          bookDescription: author, // Using author field as description
          bookPrice: price,
          bookPicture: imageSource,
        });

        setBooks(
          books.map((book) => (book.bookId === editingId ? updatedBook : book))
        );
        setEditingId(null);
      } else {
        // Create new book
        const newBook = await createBook({
          bookName: title,
          bookDescription: author, // Using author field as description
          bookPrice: price,
          bookPicture: imageSource,
        });

        setBooks([...books, newBook]);
      }

      // Reset form
      setTitle("");
      setAuthor("");
      setPrice(0);
      setImage("");
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      console.error("Failed to save book:", err);
      setError(err instanceof Error ? err.message : "Failed to save book");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (bookId: number) => {
    const book = books.find((book) => book.bookId === bookId);
    if (!book) {
      return;
    }
    setEditingId(bookId);
    setTitle(book.bookName);
    setAuthor(book.bookDescription);
    setPrice(book.bookPrice);
    setImage(book.bookPicture || "");
    setImageFile(null);
    setImagePreview(book.bookPicture || "");
  };

  const handleDelete = async (bookId: number) => {
    if (!confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      await deleteBook(bookId);
      setBooks(books.filter((book) => book.bookId !== bookId));
    } catch (err) {
      console.error("Failed to delete book:", err);
      setError(err instanceof Error ? err.message : "Failed to delete book");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImage(""); // Clear URL input when file is selected

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.value);
    if (e.target.value) {
      setImageFile(null); // Clear file when URL is entered
      setImagePreview(e.target.value);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12 gap-8">
        <h1 className="text-4xl text-gray-400 font-bold">
          Admin / Seller Book Management
        </h1>

        {/* Book Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-gray-900 p-6 rounded-lg w-80"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 rounded text-gray-400"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="p-2 rounded text-gray-400"
            required
          />
          <div className="flex flex-col gap-2">
            <span className="text-gray-400">Price</span>
            <div className="flex items-center bg-gray-800 rounded">
              <span className="px-2 text-gray-400">$</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="p-2 flex-1 rounded bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-gray-400">Book Image</span>

            {/* File Upload Option */}
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleFileChange}
                className="p-2 rounded bg-gray-800 text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-black hover:file:bg-teal-600"
              />
              <span className="text-xs text-gray-500">
                Or enter an image URL below
              </span>
            </div>

            {/* URL Input Option */}
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={image}
              onChange={handleImageUrlChange}
              className="p-2 rounded bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none"
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">Preview:</span>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-32 object-cover rounded border border-gray-600"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/50 border border-red-700 rounded text-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading
              ? "Saving..."
              : editingId !== null
              ? "Update Book"
              : "Add Book"}
          </button>
        </form>

        {/* Book List */}
        <div className="flex flex-col gap-4 w-96">
          <h2 className="text-xl font-bold mb-2">My Books</h2>

          {isFetching ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
            </div>
          ) : books.length === 0 ? (
            <p className="text-gray-400">No books yet. Add one above.</p>
          ) : (
            books.map((book) => (
              <div
                key={book.bookId}
                className="border border-gray-700 p-4 rounded flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  {book.bookPicture && (
                    <img
                      src={book.bookPicture}
                      alt={book.bookName}
                      className="w-16 h-20 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{book.bookName}</h2>
                    <p className="text-gray-400 text-sm">
                      {book.bookDescription}
                    </p>
                    <p className="text-gray-300 font-medium">
                      ${book.bookPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(book.bookId)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book.bookId)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
