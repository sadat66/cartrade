import { Footer as FooterClient } from "./footer-client";
import type { Locale } from "@/i18n/config";

export async function Footer({ locale }: { locale: Locale }) {
  // We use the client version to handle the accordion state on mobile
  return <FooterClient />;
}
