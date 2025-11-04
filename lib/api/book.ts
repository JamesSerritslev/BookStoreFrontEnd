import type { ApiBook } from "../api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function fetchAllBooks(): Promise<ApiBook[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/book`)
    if (!response.ok) {
      throw new Error(`Failed to fetch books: HTTP ${response.status}`)
    }
    return response.json()
  } catch (error: any) {
    console.error("Error fetching books:", error)
    throw new Error(error.message || "Failed to fetch books. Make sure the backend server is running.")
  }
}

export async function createNewBook(bookData: any): Promise<ApiBook> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to create book: HTTP ${response.status} - ${errorText}`)
    }
    return response.json()
  } catch (error: any) {
    console.error("Error creating book:", error)
    throw new Error(error.message || "Failed to create book")
  }
}

export async function updateBookById(id: number, bookData: any): Promise<ApiBook> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/book/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to update book: HTTP ${response.status} - ${errorText}`)
    }
    return response.json()
  } catch (error: any) {
    console.error("Error updating book:", error)
    throw new Error(error.message || "Failed to update book")
  }
}

export async function removeBookById(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/book/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to delete book: HTTP ${response.status} - ${errorText}`)
    }
  } catch (error: any) {
    console.error("Error deleting book:", error)
    throw new Error(error.message || "Failed to delete book")
  }
}