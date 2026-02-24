import { ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white overflow-y-auto">
      {/* Language dropdown – top right only */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
        <LocaleSwitcher />
      </div>

      {/* Centered: logo on top of auth card */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="relative z-10 flex flex-col items-center w-full max-w-sm gap-8">
          <Link href="/" className="relative flex items-center h-14 group shrink-0">
            <div className="absolute inset-y-0 -left-4 w-[180px] bg-[#ff385c] -skew-x-[15deg] transition-transform group-hover:scale-105 duration-300" />
            <div className="relative z-10 px-4 flex items-center h-full">
              <Image
                src="/logo/cartrageLOGO.png"
                alt="Cartrade"
                width={140}
                height={35}
                className="h-8 w-auto object-contain brightness-0 invert"
                priority
              />
            </div>
          </Link>
          <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
