"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Car,
  Calendar,
  History,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export default function DashboardSidebar({
  activeTab,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileMenuOpen,
  onMobileMenuToggle,
}: SidebarProps) {
  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      key: "dashboard",
      href: "/dashboard",
    },
    {
      icon: Car,
      label: "Listing",
      key: "listing",
      href: "/dashboard/listing",
    },
    {
      icon: Calendar,
      label: "Booking",
      key: "booking",
      href: "/dashboard/booking",
    },
    {
      icon: DollarSign,
      label: "Payments",
      key: "payments",
      href: "/dashboard/payments",
    },
    {
      icon: History,
      label: "Rental History",
      key: "history",
      href: "/dashboard/history",
    },
    {
      icon: Settings,
      label: "Settings",
      key: "settings",
      href: "/dashboard/settings",
    },
  ];

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileMenuToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isCollapsed ? "w-16" : "w-64"} 
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 
          fixed lg:relative 
          z-50 
          bg-white 
          border-r 
          border-gray-200 
          flex 
          flex-col 
          h-full 
          transition-all 
          duration-300 
          ease-in-out
        `}
      >
        {/* Logo and Toggle */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-gray-900 transition-opacity duration-200">
              Car Rental Hub
            </h1>
          )}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onMobileMenuToggle();
                }
              }}
              className={`
                w-full 
                flex 
                items-center 
                ${isCollapsed ? "justify-center px-2" : "justify-start px-4"} 
                py-3 
                rounded-lg 
                text-left 
                transition-all 
                duration-200 
                ease-in-out
                group
                relative 
                cursor-pointer
                ${activeTab === item.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium ml-3 transition-opacity duration-200">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onLogout}
            className={`
              w-full 
              flex 
              items-center 
              ${isCollapsed ? "justify-center px-2" : "justify-start px-4"} 
              py-3 
              text-red-600 
              hover:bg-red-50 
              rounded-lg 
              transition-all 
              duration-200 
              ease-in-out
              group
              relative
            cursor-pointer
            `}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium ml-3 transition-opacity duration-200">
                Logout
              </span>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
