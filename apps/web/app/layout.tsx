import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Carspixel",
  description: "مجله و فروشگاه تخصصی دنیای خودرو",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-black text-white antialiased">
        {/* Header ثابت */}
        <SiteHeader />

        {/* فاصله برای هدر ثابت */}
        <div className="pt-24">
          {children}
        </div>

        {/* Footer */}
        <SiteFooter />
      </body>
    </html>
  );
}
