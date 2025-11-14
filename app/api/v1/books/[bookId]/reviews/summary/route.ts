import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mock/data";

/**
 * GET /api/v1/books/{bookId}/reviews/summary
 * Get aggregate review summary for a book (public)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const bookIdUUID = mockStore.bookIdToUUID(parseInt(params.bookId));

    // Filter reviews for this book
    const bookReviews = mockStore.reviews.filter(
      (r) => r.bookId === bookIdUUID
    );

    // Calculate statistics
    const count = bookReviews.length;
    const distribution = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    let totalRating = 0;

    bookReviews.forEach((review) => {
      const rating = review.rating.toString() as "1" | "2" | "3" | "4" | "5";
      distribution[rating]++;
      totalRating += review.rating;
    });

    const average = count > 0 ? totalRating / count : 0;

    return NextResponse.json(
      {
        success: true,
        message: "Summary retrieved",
        data: {
          bookId: bookIdUUID,
          average: Number(average.toFixed(1)),
          count,
          distribution,
        },
        timestamp: new Date().toISOString().substring(0, 19),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get review summary error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: { code: "INTERNAL", details: "Failed to retrieve summary" },
        timestamp: new Date().toISOString().substring(0, 19),
      },
      { status: 500 }
    );
  }
}
