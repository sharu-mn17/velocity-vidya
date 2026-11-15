import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Velocity Vidya | SSLC, PUC & KCET Study Materials",
  description:
    "Free notes, previous year question papers, important questions and solutions for SSLC (KSEEB), PUC Science and KCET. By Niveditha T S.",
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