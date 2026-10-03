import { NextResponse } from "next/server";

export function validateJsonMutation(request: Request) {
  const allowedOrigins = new Set([new URL(request.url).origin]);

  // A proxy or wildcard listen address may differ from the browser's public URL.
  // Trust the configured origin, never arbitrary forwarded headers.
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      const publicUrl = new URL(process.env.NEXT_PUBLIC_APP_URL);
      if (["http:", "https:"].includes(publicUrl.protocol) && !publicUrl.username && !publicUrl.password) {
        allowedOrigins.add(publicUrl.origin);
      }
    } catch {
      // Invalid configuration must not broaden the allowed origins.
    }
  }

  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) {
    return NextResponse.json({ error: "Cross-origin requests are not allowed." }, { status: 403 });
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return NextResponse.json({ error: "Use application/json." }, { status: 415 });
  }
  return null;
}
