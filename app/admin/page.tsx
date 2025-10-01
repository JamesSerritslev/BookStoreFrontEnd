"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

type Book = {
    id: number
    title: string
    author: string
    price: number
    quantity: number
}

export default function AdminPage() {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)
    const [books, setBooks] = useState<Book[]>([])
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [price, setPrice] = useState(0)
    const [editingId, setEditingId] = useState<number | null>(null)


    useEffect(() => {
        const role = localStorage.getItem("role")

        if (role === "admin") {
        setAuthorized(true) // allow rendering
        } else {
        router.replace("/login") // redirect non-admins
        }
    }, [router])

    if (!authorized) {
        return null
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingId !== null) {
            setBooks(books.map(book => book.id === editingId ? { ...book, title, author, price } : book))
            setEditingId(null)
        } else {
            const newBook: Book = {
                id: Date.now(),
                title,
                author,
                price,
                quantity: 1
            }
            setBooks([...books, newBook])
        }
        setTitle("")
        setAuthor("")
        setPrice(0)
    }

    const handleEdit = (id: number) => {
        const book = books.find(book => book.id === id)
        if(!book) {
            return
        }
        setEditingId(id)
        setTitle(book.title)
        setAuthor(book.author)
        setPrice(book.price)
    }

    const handleDelete = (id: number) => {
        setBooks(books.filter((book) => book.id !== id))
    }

   return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12 gap-8">
        <h1 className="text-4xl text-gray-400 font-bold">Admin / Seller Book Management</h1>

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

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            {editingId !== null ? "Update Book" : "Add Book"}
          </button>
        </form>

        {/* Book List */}
        <div className="flex flex-col gap-4 w-96">
          {books.length === 0 ? (
            <p>No books yet. Add one above.</p>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className="border border-gray-700 p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{book.title}</h2>
                  <p className="text-gray-400">{book.author}</p>
                  <p className="text-gray-400">${book.price}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(book.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
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
  )

}