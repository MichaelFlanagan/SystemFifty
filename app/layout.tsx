import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/session-provider";

export const metadata: Metadata = {
  title: "System Fifty",
  description: "Expert sports betting picks and analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
