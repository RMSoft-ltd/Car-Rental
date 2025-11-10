"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Navbar from "@/components/Navbar";
import AuthInitializer from "@/components/AuthInitializer";
import "./globals.css";
import ToastProvider from "@/app/shared/ToastProvider";
import { SocketProvider } from "@/components/SocketProvider";
import QueryProvider from "@/config/queries-provider";

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
        <Provider store={store}>
          <ToastProvider>
            <AuthInitializer>
              <SocketProvider apiUrl={process.env.NEXT_PUBLIC_SOCKET_URL!}>
                <LayoutContent>{children}</LayoutContent>
              </SocketProvider>
            </AuthInitializer>
          </ToastProvider>
        </Provider>
        </QueryProvider>
      </body>
    </html>
  );
}
