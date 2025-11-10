"use client";

import { Menu, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

interface DashboardHeaderProps {
  title: string;
  onMobileMenuToggle: () => void;
  isCollapsed: boolean;
}

export default function DashboardHeader({
  title,
  onMobileMenuToggle,
}: DashboardHeaderProps) {
  const { user, isLoading } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 lg:py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Side - Notifications & User Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationDropdown />

          {/* User Profile with Loading State */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            {isLoading ? (
              <>
                <div className="hidden sm:block text-right space-y-1">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-full animate-pulse"></div>
              </>
            ) : user ? (
              <>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.fName} {user.lName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-gray-500">Not signed in</p>
                </div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
