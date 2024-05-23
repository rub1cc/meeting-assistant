import { NextResponse } from "next/server";

const isPrivateV1Api = (pathname) => pathname.startsWith("/api/v1/transcribe");

export function middleware(request) {
  if (
    isPrivateV1Api(request.nextUrl.pathname) &&
    request.headers.get("api-key") !== process.env.V1_API_KEY
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}
