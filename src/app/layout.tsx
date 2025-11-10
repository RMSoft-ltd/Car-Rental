"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import "./globals.css";
import ToastProvider from "@/app/shared/ToastProvider";
import { SocketProvider } from "@/components/SocketProvider";
import QueryProvider from "@/config/queries-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isDashboardPage = pathname?.startsWith("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && !isDashboardPage && <Navbar />}
      <main>{children}</main>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <ToastProvider>
                <SocketProvider apiUrl={process.env.NEXT_PUBLIC_SOCKET_URL!}>
                  <LayoutContent>{children}</LayoutContent>
                </SocketProvider>
              </ToastProvider>
            </NotificationProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
