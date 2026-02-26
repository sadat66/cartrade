"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  ChevronDown
} from "lucide-react";

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  const footerSections = [
    {
      title: t("footer.buy"),
      links: [
        { href: "/cars", label: t("footer.allCars") },
        { href: "/cars?status=new", label: t("footer.newCars") },
        { href: "/dealerships", label: t("footer.dealerships") },
        { href: "/why-cartrade", label: t("footer.whyCartrade") },
      ],
    },
    {
      title: t("footer.sell"),
      links: [
        { href: "/sell-my-car", label: t("footer.sellMyCar") },
        { href: "/seller/listings", label: t("footer.manageAds") },
        { href: "/instant-offer", label: t("promo.getOffer") },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { href: "/about", label: t("footer.aboutUs") },
        { href: "/careers", label: t("footer.careers") },
        { href: "/contact", label: t("footer.contact") },
        { href: "/support", label: t("footer.support") },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "Youtube" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-slate-900 pt-10 pb-8 text-slate-200 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10 mb-10">
          
          {/* Brand & Social - High Contrast */}
          <div className="lg:max-w-xs space-y-5 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/logo/cartrageLOGO.png"
                alt="Cartrade"
                width={150}
                height={38}
                className="h-9 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
            <p className="text-slate-300 text-[14px] leading-relaxed hidden sm:block max-w-sm">
              {t("footer.aboutText")}
            </p>
            <div className="flex items-center gap-4 pt-1">
              {socialLinks.map(({ icon: Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="size-10 rounded-full bg-slate-800 flex items-center justify-center transition-all hover:bg-[#ff385c] hover:text-white hover:-translate-y-1 active:scale-90 border border-slate-700/50"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Accordion for Mobile / Grid for Desktop */}
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-20 order-1 lg:order-2 w-full lg:w-auto">
            {footerSections.map((section) => (
              <div key={section.title} className="border-b border-slate-800 lg:border-none last:border-none">
                <button 
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full py-5 lg:py-0 lg:mb-5 lg:cursor-default lg:pointer-events-none group"
                >
                  <h3 className="text-white font-black tracking-widest uppercase text-[12px] lg:text-[13px]">
                    {section.title}
                  </h3>
                  <ChevronDown className={cn(
                    "size-5 text-slate-400 transition-transform duration-300 lg:hidden",
                    openSection === section.title && "rotate-180 text-[#ff385c]"
                  )} />
                </button>
                
                <ul className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out lg:max-h-none",
                  openSection === section.title ? "max-h-60 pb-6" : "max-h-0 lg:max-h-none"
                )}>
                  {section.links.map((link) => (
                    <li key={link.href} className="mb-3.5 last:mb-0">
                      <Link
                        href={link.href}
                        className="text-[15px] font-semibold text-slate-300 hover:text-[#ff385c] transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info - Restored high contrast and readability */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-slate-800/80 mb-8 sm:gap-8">
          <div className="flex items-center gap-4 group">
            <div className="size-11 rounded-xl bg-slate-800 flex items-center justify-center text-[#ff385c] border border-slate-700/50 group-hover:bg-[#ff385c] group-hover:text-white transition-all">
              <Phone className="size-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-0.5">Call Us</p>
              <a href="tel:+880123456789" className="text-[16px] font-bold text-white hover:text-[#ff385c] transition-colors tracking-tight">+880 123 456 789</a>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="size-11 rounded-xl bg-slate-800 flex items-center justify-center text-[#ff385c] border border-slate-700/50 group-hover:bg-[#ff385c] group-hover:text-white transition-all">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-0.5">Email Us</p>
              <a href="mailto:support@cartrade.com" className="text-[16px] font-bold text-white hover:text-[#ff385c] transition-colors tracking-tight">support@cartrade.com</a>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="size-11 rounded-xl bg-slate-800 flex items-center justify-center text-[#ff385c] border border-slate-700/50 group-hover:bg-[#ff385c] group-hover:text-white transition-all">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-0.5">Visit Us</p>
              <p className="text-[16px] font-bold text-white leading-tight tracking-tight">Banani, Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Clear Readability */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 pt-4">
          <p className="text-[13px] text-slate-400 font-bold order-2 lg:order-1 text-center">
            {t("footer.rights", { year: currentYear.toString() })}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 order-1 lg:order-2">
            <Link href="/privacy" className="text-[12px] font-black uppercase tracking-widest hover:text-white transition-colors text-slate-400">{t("footer.privacy")}</Link>
            <Link href="/terms" className="text-[12px] font-black uppercase tracking-widest hover:text-white transition-colors text-slate-400">{t("footer.terms")}</Link>
            <Link href="/cookies" className="text-[12px] font-black uppercase tracking-widest hover:text-white transition-colors text-slate-400">{t("footer.cookiePolicy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
