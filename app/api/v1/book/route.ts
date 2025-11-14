import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mock/data";

/**
 * Helper to decode token and check authorization
 */
function decodeToken(request: NextRequest): any {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    // Check expiration
    if (decoded.exp && decoded.exp < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

/**
 * GET /api/v1/book
 * Get all books (public endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    // Return all books
    return NextResponse.json(mockStore.books, { status: 200 });
  } catch (error) {
    console.error("Get books error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve books" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/book
 * Create a new book (requires SELLER or ADMIN role)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const decoded = decodeToken(request);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check authorization (SELLER or ADMIN only)
    if (decoded.role !== "SELLER" && decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only sellers and admins can create books" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { bookName, bookDescription, bookPrice, bookPicture } = body;

    // Validation
    if (
      !bookName ||
      !bookDescription ||
      bookPrice === undefined ||
      !bookPicture
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: bookName, bookDescription, bookPrice, bookPicture",
        },
        { status: 400 }
      );
    }

    // Create new book with seller ID
    const sellerId = mockStore.userIdToUUID(decoded.userId);

    const newBook = {
      bookId: mockStore.getNextBookId(),
      bookName,
      bookDescription,
      bookPrice: Number(bookPrice),
      bookPicture,
      sellerId, // Track who listed this book
      createdAt: new Date().toISOString(),
    };

    mockStore.books.push(newBook);

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Create book error:", error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}
