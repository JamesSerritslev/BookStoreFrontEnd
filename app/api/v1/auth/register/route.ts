import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mock/data";

/**
 * POST /api/v1/auth/register
 * Register new user and return JWT token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, role } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: firstName, lastName, email, password",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 422 }
      );
    }

    // Check if email already exists
    const existingUser = mockStore.users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: mockStore.getNextUserId(),
      email,
      password, // In mock mode only!
      firstName,
      lastName,
      role: (role as "BUYER" | "SELLER" | "ADMIN") || "BUYER",
      accountStatus: "ACTIVE" as const,
      createdAt: new Date().toISOString(),
    };

    mockStore.users.push(newUser);

    // Generate mock JWT
    const mockToken = Buffer.from(
      JSON.stringify({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      })
    ).toString("base64");

    // Return AuthResponse
    return NextResponse.json(
      {
        token: mockToken,
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration service unavailable" },
      { status: 500 }
    );
  }
}
