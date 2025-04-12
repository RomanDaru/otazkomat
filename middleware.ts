import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Only check POST requests to /api/ask
  if (request.nextUrl.pathname === "/api/ask" && request.method === "POST") {
    // Check if user is authenticated
    const token = await getToken({ req: request });

    if (!token) {
      // If not authenticated, check for the free question cookie
      const hasFreeQuestion = request.cookies.has("askedFreeQuestion");

      if (hasFreeQuestion) {
        return NextResponse.json(
          {
            error:
              "Pre ďalšie otázky sa, prosím, prihláste pomocou Google účtu.",
            requiresLogin: true,
          },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/ask",
};
