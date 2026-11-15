import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Velocity Vidya | SSLC, PUC & KCET Study Materials",
  description:
    "Free notes, previous year question papers, important questions and solutions for SSLC (KSEEB), PUC Science and KCET. By Niveditha T S.",
  openGraph: {
    title: "Velocity Vidya",
    description: "Free SSLC, PUC Science and KCET study materials.",
    images: ["/logo.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-vv-navy text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}