"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/dashboard/listing":
        return "Car Listing";
      case "/dashboard/add-listing":
        return "Add Car Details";
      case "/dashboard/booking":
        return "Bookings";
      case "/dashboard/payments":
        return "Payments";
      case "/dashboard/history":
        return "Rental History";
      case "/dashboard/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const getActiveTab = () => {
    if (pathname === "/dashboard") return "dashboard";
    if (pathname.startsWith("/dashboard/listing") || pathname === "/dashboard/add-listing") return "listing";
    if (pathname.startsWith("/dashboard/booking")) return "booking";
    if (pathname.startsWith("/dashboard/payments")) return "payments";
    if (pathname.startsWith("/dashboard/history")) return "history";
    if (pathname.startsWith("/dashboard/settings")) return "settings";
    return "dashboard";
  };

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <div className="flex h-full">
        <DashboardSidebar
          activeTab={getActiveTab()}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div
          className={`
          flex-1 
          flex 
          flex-col 
          h-full 
          transition-all 
          duration-300 
          ease-in-out
          ${isSidebarCollapsed ? "lg:ml-0" : "lg:ml-0"}
        `}
        >
          <DashboardHeader
            title={getPageTitle()}
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isCollapsed={isSidebarCollapsed}
          />
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}
