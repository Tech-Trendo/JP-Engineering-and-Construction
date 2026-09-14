import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const target = "https://app.jpengineering.com.np/api/v1/public/categories/";
  const results: Record<string, unknown> = {
    target,
    env_NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    env_NODE_ENV: process.env.NODE_ENV,
  };

  try {
    const t0 = Date.now();
    const res = await fetch(target, {
      cache: "no-store",
      headers: {
        "Accept": "application/json",
      },
    });
    results.elapsedMs = Date.now() - t0;
    results.status = res.status;
    results.statusText = res.statusText;
    const body = await res.text();
    results.bodyLength = body.length;
    results.bodyPreview = body.slice(0, 300);
  } catch (err: unknown) {
    if (err instanceof Error) {
      results.error = err.message;
      results.errorName = err.name;
      results.errorStack = err.stack;
      results.cause = (err as { cause?: unknown }).cause;
    } else {
      results.error = String(err);
    }
  }

  return NextResponse.json(results);
}
