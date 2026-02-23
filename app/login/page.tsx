import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; auth_error?: string }>;
}) {
  const { next, auth_error } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to save listings, message sellers, and manage your profile
          </p>
        </div>
        <LoginForm next={next ?? "/dashboard"} authError={!!auth_error} />
      </div>
    </div>
  );
}
