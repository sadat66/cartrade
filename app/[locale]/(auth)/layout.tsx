import { ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1e293b] px-4 overflow-y-auto py-10">
      {/* Background decoration for premium feel */}
      <div className="absolute inset-x-0 top-[-10%] h-[1000px] w-full rounded-full bg-[radial-gradient(circle_farthest-side_at_center,rgba(37,99,235,0.15),transparent)] blur-3xl" />

      {/* Language Switcher in top right */}
      <div className="absolute top-6 right-6 z-20">
        <LocaleSwitcher className="h-9 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        {/* Logo outside the card without its own background */}
        <div className="mb-10 transition-transform duration-300 hover:scale-105">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo/cartrageLOGO.png"
              alt="Cartrade"
              width={200}
              height={52}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Form Content in its own glass container */}
        <div className="w-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
