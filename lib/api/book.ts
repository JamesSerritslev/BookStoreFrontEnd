import type { ApiBook } from "../api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ---------------------------
// GET ALL BOOKS
// ---------------------------
export async function getAllBooks(): Promise<ApiBook[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/book`);
  if (!response.ok) {
    throw new Error(`Failed to fetch books: HTTP ${response.status}`);
  }
  return response.json();
}

// ---------------------------
// CREATE BOOK
// ---------------------------
export async function createBook(bookData: any): Promise<ApiBook> {
  const response = await fetch(`${API_BASE_URL}/api/v1/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to create book: HTTP ${response.status} - ${errorText}`
    );
  }
  return response.json();
}

// ---------------------------
// UPDATE BOOK
// ---------------------------
export async function updateBook(
  id: number,
  bookData: any
): Promise<ApiBook> {
  const response = await fetch(`${API_BASE_URL}/api/v1/book/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update book: HTTP ${response.status} - ${errorText}`
    );
  }
  return response.json();
}

// ---------------------------
// DELETE BOOK
// ---------------------------
export async function deleteBook(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/book/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to delete book: HTTP ${response.status} - ${errorText}`
    );
  }
}
