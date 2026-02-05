import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moonbeam Café - Order Ahead",
  description: "Handcrafted beverages made with organic ingredients. Order ahead and skip the line at Moonbeam Café.",
  keywords: ["coffee", "cafe", "order ahead", "moonbeam", "organic", "espresso", "latte"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
