"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { fetchAllBooks, updateBookById, removeBookById } from "@/lib/api/book"
import type { ApiBook } from "@/lib/api"

export default function ManageBooksPage() {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)
    const [books, setBooks] = useState<ApiBook[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    // Edit state
    const [editingBook, setEditingBook] = useState<ApiBook | null>(null)
    const [editForm, setEditForm] = useState({
        bookName: "",
        bookDescription: "",
        bookPrice: 0,
        bookPicture: ""
    })

    useEffect(() => {
        const role = localStorage.getItem("role")
        if (role === "admin" || role === "seller") {
            setAuthorized(true)
            loadBooks()
        } else {
            router.replace("/login")
        }
    }, [router])

    const loadBooks = async () => {
        try {
            setLoading(true)
            const fetchedBooks = await fetchAllBooks()
            setBooks(fetchedBooks)
            setError(null)
        } catch (err: any) {
            setError(err.message || "Failed to load books")
            console.error("Error loading books:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (book: ApiBook) => {
        setEditingBook(book)
        setEditForm({
            bookName: book.bookName,
            bookDescription: book.bookDescription,
            bookPrice: book.bookPrice,
            bookPicture: book.bookPicture
        })
    }

    const handleSaveEdit = async () => {
        if (!editingBook) return

        try {
            await updateBookById(editingBook.bookId, {
                bookName: editForm.bookName.trim(),
                bookDescription: editForm.bookDescription.trim(),
                bookPrice: editForm.bookPrice,
                bookPicture: editForm.bookPicture.trim()
            })
            setEditingBook(null)
            await loadBooks()
        } catch (err: any) {
            setError(err.message || "Failed to update book")
            console.error("Error updating book:", err)
        }
    }

    const handleCancelEdit = () => {
        setEditingBook(null)
        setEditForm({ bookName: "", bookDescription: "", bookPrice: 0, bookPicture: "" })
    }

    const handleDelete = async (bookId: number, bookName: string) => {
        if (!confirm(`Are you sure you want to delete "${bookName}"?`)) {
            return
        }

        try {
            await removeBookById(bookId)
            await loadBooks()
        } catch (err: any) {
            setError(err.message || "Failed to delete book")
            console.error("Error deleting book:", err)
        }
    }

    if (!authorized) {
        return null
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />
            <main className="flex-1 py-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl text-gray-400 font-bold mb-6">Manage Books</h1>

                    {error && (
                        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-gray-400">Loading books...</div>
                    ) : books.length === 0 ? (
                        <div className="text-gray-400">No books found.</div>
                    ) : (
                        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                            <table className="w-full">
                                <thead className="bg-gray-800 border-b border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Image</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map((book) => (
                                        <tr
                                            key={book.bookId}
                                            className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                {book.bookPicture ? (
                                                    <img
                                                        src={book.bookPicture}
                                                        alt={book.bookName}
                                                        className="w-16 h-20 object-cover rounded"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none'
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-16 h-20 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-xs">
                                                        No Image
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingBook?.bookId === book.bookId ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.bookName}
                                                        onChange={(e) => setEditForm({ ...editForm, bookName: e.target.value })}
                                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-teal-400"
                                                    />
                                                ) : (
                                                    <div className="font-medium">{book.bookName}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingBook?.bookId === book.bookId ? (
                                                    <textarea
                                                        value={editForm.bookDescription}
                                                        onChange={(e) => setEditForm({ ...editForm, bookDescription: e.target.value })}
                                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-teal-400 min-h-[80px]"
                                                    />
                                                ) : (
                                                    <div className="text-gray-300 text-sm max-w-md line-clamp-3">{book.bookDescription}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingBook?.bookId === book.bookId ? (
                                                    <div className="flex items-center">
                                                        <span className="text-gray-400 mr-1">$</span>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={editForm.bookPrice}
                                                            onChange={(e) => setEditForm({ ...editForm, bookPrice: Number(e.target.value) })}
                                                            className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-teal-400"
                                                            min="0"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="font-medium">${book.bookPrice.toFixed(2)}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingBook?.bookId === book.bookId ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleSaveEdit}
                                                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-medium"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(book)}
                                                            className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(book.bookId, book.bookName)}
                                                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Edit Image URL Modal/Input */}
                    {editingBook && (
                        <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={editForm.bookPicture}
                                onChange={(e) => setEditForm({ ...editForm, bookPicture: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
                            />
                            {editForm.bookPicture && (
                                <div className="mt-2">
                                    <img
                                        src={editForm.bookPicture}
                                        alt="Preview"
                                        className="w-24 h-32 object-cover rounded border border-gray-600"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}