import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FSC - Factory Supply Chain",
  description: "B2B Sourcing Platform connecting Chinese cross-border sellers with US & Mexico factories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  );
}
