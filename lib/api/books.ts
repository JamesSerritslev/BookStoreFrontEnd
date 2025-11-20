import { getApiUrl, getApiHeaders } from "@/lib/config";

export interface Book {
  bookId: number;
  bookName: string;
  bookDescription: string;
  bookPrice: number;
  bookPicture: string;
  sellerId?: string; // UUID of seller who listed this book
  createdAt?: string;
}

export interface CreateBookRequest {
  bookName: string;
  bookDescription: string;
  bookPrice: number;
  bookPicture: string;
}

export interface UpdateBookRequest {
  bookName?: string;
  bookDescription?: string;
  bookPrice?: number;
  bookPicture?: string;
}

/**
 * Get all books
 */
export async function getAllBooks(): Promise<Book[]> {
  const response = await fetch(getApiUrl("/api/v1/book"), {
    method: "GET",
    headers: getApiHeaders(false), // Public endpoint, no auth required
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Get a single book by ID
 */
export async function getBookById(bookId: number): Promise<Book> {
  const response = await fetch(getApiUrl(`/api/v1/book/${bookId}`), {
    method: "GET",
    headers: getApiHeaders(false),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch book: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Create a new book (SELLER/ADMIN only)
 */
export async function createBook(book: CreateBookRequest): Promise<Book> {
  const response = await fetch(getApiUrl("/api/v1/book"), {
    method: "POST",
    headers: getApiHeaders(true), // Requires auth
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error || `Failed to create book: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}

/**
 * Update an existing book (SELLER/ADMIN only)
 */
export async function updateBook(
  bookId: number,
  updates: UpdateBookRequest
): Promise<Book> {
  const response = await fetch(getApiUrl(`/api/v1/book/${bookId}`), {
    method: "PUT",
    headers: getApiHeaders(true), // Requires auth
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error || `Failed to update book: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}

/**
 * Delete a book (SELLER/ADMIN only)
 */
export async function deleteBook(bookId: number): Promise<void> {
  const response = await fetch(getApiUrl(`/api/v1/book/${bookId}`), {
    method: "DELETE",
    headers: getApiHeaders(true), // Requires auth
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error || `Failed to delete book: ${response.statusText}`
    );
  }
}


