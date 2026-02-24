import { type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const intlResponse = await intlMiddleware(request);

  // Skip auth refresh for static assets and specific paths
  const { pathname } = request.nextUrl;
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return intlResponse;
  }

  return await updateSession(request, intlResponse ?? undefined);
}

export const config = {
  matcher: [
    // Match all paths except those starting with specific prefixes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
