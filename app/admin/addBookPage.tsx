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
    image?: string
}

export default function AddBookPage() {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)
    const [books, setBooks] = useState<Book[]>([])
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState<string>("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>("")
    const [editingId, setEditingId] = useState<number | null>(null)


    useEffect(() => {
        const role = localStorage.getItem("role")

        if (role === "admin" || role === "seller") {
        setAuthorized(true) // allow rendering for both admins and sellers
        } else {
        router.replace("/login") // redirect non-authorized users
        }
    }, [router])

    if (!authorized) {
        return null
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // Determine which image source to use
        const imageSource = imageFile ? imagePreview : image
        
        if (editingId !== null) {
            setBooks(books.map(book => book.id === editingId ? { ...book, title, author, price, image: imageSource } : book))
            setEditingId(null)
        } else {
            const newBook: Book = {
                id: Date.now(),
                title,
                author,
                price,
                quantity: 1,
                image: imageSource
            }
            setBooks([...books, newBook])
        }
        
        // Reset form
        setTitle("")
        setAuthor("")
        setPrice(0)
        setImage("")
        setImageFile(null)
        setImagePreview("")
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
        setImage(book.image || "")
        setImageFile(null)
        setImagePreview(book.image || "")
    }

    const handleDelete = (id: number) => {
        setBooks(books.filter((book) => book.id !== id))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            setImageFile(file)
            setImage("") // Clear URL input when file is selected
            
            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImage(e.target.value)
        if (e.target.value) {
            setImageFile(null) // Clear file when URL is entered
            setImagePreview(e.target.value)
        }
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
               <span className="text-xs text-gray-500">Or enter an image URL below</span>
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
                     e.currentTarget.style.display = 'none'
                   }}
                 />
               </div>
             )}
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
                 <div className="flex items-center gap-4">
                   {book.image && (
                     <img
                       src={book.image}
                       alt={book.title}
                       className="w-16 h-20 object-cover rounded"
                       onError={(e) => {
                         e.currentTarget.style.display = 'none'
                       }}
                     />
                   )}
                   <div>
                     <h2 className="text-lg font-semibold">{book.title}</h2>
                     <p className="text-gray-400">{book.author}</p>
                     <p className="text-gray-400">${book.price}</p>
                   </div>
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