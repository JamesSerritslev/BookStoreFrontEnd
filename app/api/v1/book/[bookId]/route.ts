import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mock/data";

/**
 * Helper to decode token
 */
function decodeToken(request: NextRequest): any {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    if (decoded.exp && decoded.exp < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

/**
 * PUT /api/v1/book/{bookId}
 * Update an existing book (requires SELLER or ADMIN role)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    // Check authentication
    const decoded = decodeToken(request);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check authorization
    if (decoded.role !== "SELLER" && decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only sellers and admins can update books" },
        { status: 403 }
      );
    }

    const bookId = parseInt(params.bookId);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    // Find book
    const bookIndex = mockStore.books.findIndex((b) => b.bookId === bookId);

    if (bookIndex === -1) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const body = await request.json();
    const { bookName, bookDescription, bookPrice, bookPicture } = body;

    // Update book (partial update allowed)
    const updatedBook = {
      ...mockStore.books[bookIndex],
      ...(bookName && { bookName }),
      ...(bookDescription && { bookDescription }),
      ...(bookPrice !== undefined && { bookPrice: Number(bookPrice) }),
      ...(bookPicture && { bookPicture }),
    };

    mockStore.books[bookIndex] = updatedBook;

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.error("Update book error:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/book/{bookId}
 * Delete a book (requires SELLER or ADMIN role)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    // Check authentication
    const decoded = decodeToken(request);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check authorization
    if (decoded.role !== "SELLER" && decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only sellers and admins can delete books" },
        { status: 403 }
      );
    }

    const bookId = parseInt(params.bookId);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    // Find and remove book
    const bookIndex = mockStore.books.findIndex((b) => b.bookId === bookId);

    if (bookIndex === -1) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    mockStore.books.splice(bookIndex, 1);

    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete book error:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
