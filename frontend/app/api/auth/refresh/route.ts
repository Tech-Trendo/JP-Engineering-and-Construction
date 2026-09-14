import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("admin_refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { detail: "No refresh token available." },
        { status: 401 }
      );
    }

    const backendUrl =
      process.env.INTERNAL_BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://app.jpengineering.com.np/api/v1"
        : "http://127.0.0.1:8000/api/v1");

    const backendRes = await fetch(`${backendUrl}/auth/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      const response = NextResponse.json(data, { status: backendRes.status });
      response.cookies.delete("admin_refresh_token");
      return response;
    }

    const { access, refresh: newRefresh } = data;

    const response = NextResponse.json({ access }, { status: 200 });

    if (newRefresh) {
      response.cookies.set({
        name: "admin_refresh_token",
        value: newRefresh,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error) {
    console.error("Refresh route error:", error);
    return NextResponse.json(
      { detail: "Internal server error occurred while refreshing token." },
      { status: 500 }
    );
  }
}
