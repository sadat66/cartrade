import { PageLoader } from "@/components/ui/page-loader";

export default function AuthLoading() {
  return (
    <div className="fixed inset-0 z-[150] bg-white flex items-center justify-center">
      <PageLoader transparent className="h-full" />
    </div>
  );
}
