import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Supabase redirects here after email confirmation, OAuth, or magic link.
 * Exchanges the code for a session and ensures cookies are on the redirect response.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?auth_error=1`);
  }

  const cookieStore = await cookies();
  const savedCookies: { name: string; value: string; options?: Record<string, unknown> }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            savedCookies.push({ name, value, options });
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?auth_error=1`);
  }

  const target = next.startsWith("/dashboard") ? `${next}?confirmed=1` : next;
  const res = NextResponse.redirect(`${origin}${target}`);
  savedCookies.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, options as Parameters<NextResponse["cookies"]["set"]>[2]);
  });
  return res;
}
