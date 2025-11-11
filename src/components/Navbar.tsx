"use client";

import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { FaBars, FaTimes } from "react-icons/fa";
import { User, LayoutDashboard, LogOut } from "lucide-react";
import { HiChevronDown } from "react-icons/hi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/shared/ToastProvider";
import clsx from "clsx";
import { UserAvatar } from "./Avator";

export default function Navbar() {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed Out", "You have been signed out successfully.");
      setIsMobileMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout Failed", "An error occurred during logout");
    }
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!isMounted) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="block">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
                  <span className="hidden sm:inline">
                    Car & Driver Rental Hub
                  </span>
                  <span className="sm:hidden">Car Rental</span>
                </span>
              </Link>
            </div>
            <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
                <span className="hidden sm:inline">
                  Car & Driver Rental Hub
                </span>
                <span className="sm:hidden">Car Rental</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* Cart Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button className="text-gray-700 hover:text-gray-900 p-2 relative cursor-pointer transition-colors">
                  <Image
                    src="/images/cart.svg"
                    alt="Cart"
                    width={28}
                    height={28}
                    className="lg:w-8 lg:h-8 object-contain"
                  />
                  {/* Quantity Badge */}
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>

              {/* Total Price */}
              <div className="hidden lg:block text-sm text-gray-700">
                <span className="font-semibold">RWF 245,000</span>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-300"></div>

            {/* Profile Section */}
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button
                  className="flex items-center text-gray-900 hover:text-gray-700 p-2 rounded-md cursor-pointer outline-none focus:outline-none transition-colors"
                  onClick={!isAuthenticated ? handleProfileClick : undefined}
                >
                  {/* <Image
                    src="/images/abstract-user-flat-4.png"
                    alt="User Icon"
                    width={32}
                    height={32}
                    className="h-8 w-8 lg:h-10 lg:w-10"
                  /> */}

                  {user ? (
                    <UserAvatar user={user} size="default" />
                  ) : (
                    <Image
                      src="/images/abstract-user-flat-4.png"
                      alt="User Icon"
                      width={32}
                      height={32}
                      className="h-8 w-8 lg:h-10 lg:w-10"
                    />
                  )}

                  {/* User Info */}
                  {isAuthenticated && user && (
                    <div className="hidden lg:block ml-3 text-left">
                      <p className="text-sm lg:text-base font-bold text-gray-900">
                        {user.lName ? `${user.lName}` : "User"}
                      </p>
                      <p className="text-xs font-medium text-gray-500 truncate max-w-[120px] lg:max-w-[150px]">
                        {user.email}
                      </p>
                    </div>
                  )}

                  {isAuthenticated && (
                    <HiChevronDown className="ml-1 lg:ml-2 h-4 w-4 flex-shrink-0" />
                  )}
                </Menu.Button>
              </div>

              {isAuthenticated && (
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-700">Signed in as</p>
                      <p className="text-sm font-semibodtext-gray-900 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={clsx(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                            )}
                          >
                            <User className="mr-3 h-4 w-4" />
                            Manage Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard"
                            className={clsx(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                            )}
                          >
                            <LayoutDashboard className="mr-3 h-4 w-4" />
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                    </div>

                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={clsx(
                              active
                                ? "bg-red-50 text-red-700"
                                : "text-gray-700",
                              "flex items-center w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                            )}
                          >
                            <LogOut className="mr-3 h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              )}
            </Menu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart */}
            <div className="relative">
              <button className="text-gray-700 hover:text-gray-900 p-2 relative cursor-pointer transition-colors">
                <Image
                  src="/images/cart.svg"
                  alt="Cart"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="text-gray-900 hover:text-gray-700 p-2 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <Transition
          show={isMobileMenuOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {/* Mobile Price Display */}
              <div className="px-3 py-2 text-center bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-700">
                  Total: RWF 245,000
                </span>
              </div>

              {isAuthenticated ? (
                <>
                  {/* User Info in Mobile */}
                  <div className="px-3 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Image
                        src="/images/abstract-user-flat-4.png"
                        alt="User Icon"
                        width={32}
                        height={32}
                        className="h-8 w-8"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.lName ? `${user.lName}` : "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Menu Items */}
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <User className="mr-3 h-5 w-5" />
                    Manage Profile
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <User className="mr-3 h-5 w-5" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </Transition>
      </div>
    </nav>
  );
}
