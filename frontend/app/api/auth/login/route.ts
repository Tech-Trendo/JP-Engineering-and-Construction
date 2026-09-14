import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { detail: "Username and password are required." },
        { status: 400 }
      );
    }

    const backendUrl =
      process.env.INTERNAL_BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://app.jpengineering.com.np/api/v1"
        : "http://127.0.0.1:8000/api/v1");

    const backendRes = await fetch(`${backendUrl}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    const { access, refresh, user } = data;

    const response = NextResponse.json(
      { access, user },
      { status: 200 }
    );

    // Store refresh token in an httpOnly cookie
    response.cookies.set({
      name: "admin_refresh_token",
      value: refresh,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { detail: "Internal server error occurred while logging in." },
      { status: 500 }
    );
  }
}
