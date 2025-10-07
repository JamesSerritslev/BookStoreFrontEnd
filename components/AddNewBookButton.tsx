"use client"

import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

export default function AddNewBookButton() {
  const router = useRouter()

  return (
    <button 
      className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
      onClick={(e) => {
        e.preventDefault()
        router.push("/admin") // 👈 go to AdminPage
      }}
    >
      <Plus className="h-4 w-4" />
      Add New Book
    </button>
  )
}
