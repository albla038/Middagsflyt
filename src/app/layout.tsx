import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CircleAlert, CircleCheck } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Middagsflyt",
  // description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-svh font-inter antialiased`}>
        {children}
        <Toaster
          icons={{
            success: <CircleCheck className="size-4 text-primary" />,
            error: <CircleAlert className="size-4 text-destructive" />,
          }}
        />
      </body>
    </html>
  );
}
