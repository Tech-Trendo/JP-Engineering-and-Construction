import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("admin_refresh_token")?.value;

    if (refreshToken) {
      const backendUrl =
        process.env.INTERNAL_BACKEND_API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://127.0.0.1:8000/api/v1";

      try {
        await fetch(`${backendUrl}/auth/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (backendErr) {
        console.warn("Backend logout notification failed:", backendErr);
      }
    }

    const response = NextResponse.json(
      { detail: "Successfully logged out." },
      { status: 200 }
    );

    // Clear the httpOnly cookie
    response.cookies.delete("admin_refresh_token");

    return response;
  } catch (error) {
    console.error("Logout route error:", error);
    const response = NextResponse.json(
      { detail: "Logged out with errors." },
      { status: 200 }
    );
    response.cookies.delete("admin_refresh_token");
    return response;
  }
}
