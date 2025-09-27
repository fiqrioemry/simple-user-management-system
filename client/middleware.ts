import { NextRequest, NextResponse } from "next/server";

const unauthenticatedPaths = ["/signin", "/reset-password"];

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const { pathname } = request.nextUrl;

  // if user is logged in and trying to access signin/reset → redirect to "/"
  if (
    sessionToken &&
    unauthenticatedPaths.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // if user is not logged in and trying to access protected routes → redirect to signin
  if (
    !sessionToken &&
    !unauthenticatedPaths.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // default → lanjutkan
  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/",
    "/users/:path*",
    "/employees/:path*",
    "/profile/:path*",
    "/audit-logs/:path*",
    "/signin",
    "/reset-password",
  ],
};
