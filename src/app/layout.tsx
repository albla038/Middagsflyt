import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import ThemeProvider from "@/providers/theme-provider";
import ReactQueryProvider from "@/providers/react-query-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-svh font-inter antialiased`}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster
          icons={{
            success: <CircleCheck className="size-4 text-primary" />,
            error: <CircleAlert className="size-4 text-destructive" />,
            loading: (
              <LoaderCircle className="size-4 animate-spin text-foreground" />
            ),
          }}
        />
      </body>
    </html>
  );
}
