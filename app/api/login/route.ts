import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { authenticateUser } from "@/lib/auth";
import { rateLimiter } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (only if Upstash is configured)
    if (rateLimiter) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1";
      const rateLimitResult = await rateLimiter.limit(ip);

      if (!rateLimitResult.success) {
        return NextResponse.json(
          { message: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { email, password } = validationResult.data;

    // Authenticate user
    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    const token = `${user.id}:${crypto.randomBytes(16).toString("hex")}`;
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // Set session cookie
    response.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
