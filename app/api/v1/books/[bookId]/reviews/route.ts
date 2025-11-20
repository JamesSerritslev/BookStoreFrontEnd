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
 * GET /api/v1/books/{bookId}/reviews
 * List reviews for a book (public, with pagination)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");
    const sort = searchParams.get("sort") || "createdAt,DESC";

  const bookIdUUID = mockStore.bookIdToUUID(parseInt(params.bookId));

  // Filter reviews for this book
  let bookReviews = mockStore.reviews.filter((r) => r.bookId === bookIdUUID);

    // Sort
    const [sortField, sortOrder] = sort.split(",");
    if (sortField === "createdAt") {
      bookReviews.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
      });
    }

    // Paginate
    const start = page * size;
    const end = start + size;
    const paginatedReviews = bookReviews.slice(start, end);

    return NextResponse.json(
      {
        success: true,
        message: "Reviews retrieved",
        data: {
          bookId: bookIdUUID,
          page,
          size,
          total: bookReviews.length,
          items: paginatedReviews,
        },
        timestamp: new Date().toISOString().substring(0, 19),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: { code: "INTERNAL", details: "Failed to retrieve reviews" },
        timestamp: new Date().toISOString().substring(0, 19),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/books/{bookId}/reviews
 * Create a review (requires BUYER or ADMIN role)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const decoded = decodeToken(request);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
          error: { code: "UNAUTHORIZED", details: "Missing or invalid token" },
          timestamp: new Date().toISOString().substring(0, 19),
        },
        { status: 401 }
      );
    }

    // Check role
    if (decoded.role !== "BUYER" && decoded.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
          error: {
            code: "FORBIDDEN",
            details: "Only buyers and admins can create reviews",
          },
          timestamp: new Date().toISOString().substring(0, 19),
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { rating, comment } = body;

    // Validation
    if (!rating) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: {
            code: "VALIDATION_FAILED",
            details: "Rating is required",
            field_errors: { rating: "required" },
          },
          timestamp: new Date().toISOString().substring(0, 19),
        },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: {
            code: "VALIDATION_FAILED",
            details: "Rating must be between 1 and 5",
            field_errors: { rating: "must be greater than or equal to 1" },
          },
          timestamp: new Date().toISOString().substring(0, 19),
        },
        { status: 400 }
      );
    }

  const bookIdUUID = mockStore.bookIdToUUID(parseInt(params.bookId));
  const userId = decoded.userId;

    // Check if user already reviewed this book (mock reviews store userId as number)
    const existingReview = mockStore.reviews.find(
      (r) => r.bookId === bookIdUUID && r.userId === userId
    );

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: "Review already exists",
          error: {
            code: "REVIEW_ALREADY_EXISTS",
            details: "User has already reviewed this book",
          },
          timestamp: new Date().toISOString().substring(0, 19),
        },
        { status: 409 }
      );
    }

    // Create review
    const newReview = {
      id: mockStore.generateUUID(),
      bookId: bookIdUUID,
      userId,
      rating,
      comment: comment || "",
      createdAt: new Date().toISOString(),
    };

    mockStore.reviews.push(newReview);

    return NextResponse.json(
      {
        success: true,
        message: "Review created",
        data: { id: newReview.id },
        timestamp: new Date().toISOString().substring(0, 19),
      },
      {
        status: 201,
        headers: {
          Location: `/api/books/${params.bookId}/reviews/${newReview.id}`,
        },
      }
    );
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: { code: "INTERNAL", details: "Failed to create review" },
        timestamp: new Date().toISOString().substring(0, 19),
      },
      { status: 500 }
    );
  }
}
