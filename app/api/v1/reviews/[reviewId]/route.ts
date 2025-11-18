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
 * PATCH /api/v1/reviews/{reviewId}
 * Update a review (requires BUYER or ADMIN role, must be owner or admin)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
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

    // Find review
    const review = mockStore.reviews.find((r) => r.id === params.reviewId);

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
          error: { code: "REVIEW_NOT_FOUND", details: "Review does not exist" },
          timestamp: new Date().toISOString().substring(0, 19),
        },
        { status: 404 }
      );
    }

  const userId = decoded.userId;

  // Check ownership or admin (mock reviews store userId as number)
  if (review.userId !== userId && decoded.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
          error: {
            code: "FORBIDDEN",
            details: "Not authorized to update this review",
          },
          timestamp: new Date().toISOString().substring(0, 19),
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { rating, comment } = body;

    // Validation
    if (rating !== undefined && (rating < 1 || rating > 5)) {
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

    // Update review
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    return NextResponse.json(
      {
        success: true,
        message: "Review updated",
        data: review,
        timestamp: new Date().toISOString().substring(0, 19),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update review error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: { code: "INTERNAL", details: "Failed to update review" },
        timestamp: new Date().toISOString().substring(0, 19),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/reviews/{reviewId}
 * Delete a review (requires BUYER or ADMIN role, must be owner or admin)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
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

    // Find review
    const reviewIndex = mockStore.reviews.findIndex(
      (r) => r.id === params.reviewId
    );

    if (reviewIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
          error: { code: "REVIEW_NOT_FOUND", details: "Review does not exist" },
          timestamp: new Date().toISOString().substring(0, 19),
        },
        { status: 404 }
      );
    }

    const review = mockStore.reviews[reviewIndex];
  const userId = decoded.userId;

  // Check ownership or admin (mock reviews store userId as number)
  if (review.userId !== userId && decoded.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
          error: {
            code: "FORBIDDEN",
            details: "Not authorized to delete this review",
          },
          timestamp: new Date().toISOString().substring(0, 19),
        },
        { status: 403 }
      );
    }

    // Delete review
    mockStore.reviews.splice(reviewIndex, 1);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: { code: "INTERNAL", details: "Failed to delete review" },
        timestamp: new Date().toISOString().substring(0, 19),
      },
      { status: 500 }
    );
  }
}
