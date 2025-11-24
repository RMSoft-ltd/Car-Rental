"use client";

import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  User,
  LayoutDashboard,
  LogOut,
  HelpCircle,
  UserPlus,
} from "lucide-react";
import { HiChevronDown } from "react-icons/hi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/shared/ToastProvider";
import clsx from "clsx";
import { UserAvatar } from "./Avator";
import { useCartSummary } from "@/hooks/use-cart-items";

export default function Navbar() {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const userId = user?.id ?? 0;
  const { totalItems, totalPrice } = useCartSummary(userId);

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
      setIsMobileMenuOpen(false);
      router.push("/auth/signin");
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="block group">
                <Image
                  src="/logo1.png"
                  alt="KwickCar Logo"
                  width={120}
                  height={32}
                  className="w-24 sm:w-32 lg:w-40 h-auto transition-all duration-200"
                />
              </Link>
            </div>
            <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky  top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="block group">
              <Image
                src="/logo1.png"
                alt="KwickCar Logo"
                width={120}
                height={32}
                unoptimized
                className="w-24 object-cover sm:w-32 lg:w-40 h-auto transition-all duration-200"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* Cart Section */}
            {isAuthenticated && (
              <>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <button
                      onClick={() => {
                        router.push("/cart");
                      }}
                      className="text-gray-700 hover:text-gray-900 p-2 relative cursor-pointer transition-colors"
                    >
                      <Image
                        src="/images/cart.svg"
                        alt="Cart"
                        width={28}
                        height={28}
                        className="lg:w-8 lg:h-8 object-contain"
                      />
                      {/* Quantity Badge */}
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    </button>
                  </div>

                  {/* Total Price */}
                  <div
                    onClick={() => {
                      router.push("/cart");
                    }}
                    className="hidden cursor-pointer lg:block text-sm text-gray-700"
                  >
                    <span className="font-semibold">RWF {totalPrice}</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-gray-300"></div>
              </>
            )}

            {/* Profile / Auth Section */}
            {isAuthenticated && user ? (
              <Menu as="div" className="relative  inline-block text-left">
                <div>
                  <Menu.Button className="group flex items-center text-gray-900 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 cursor-pointer outline-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200">
                    <UserAvatar user={user} size="default" />
                    <div className="hidden lg:block text-left min-w-0 flex-1 ml-2">
                      <p className="text-sm lg:text-base font-semibold text-gray-900 truncate">
                        {user.lName ? `${user.lName}` : "User"}
                      </p>
                      <p className="text-xs font-medium text-gray-500 truncate max-w-[120px] lg:max-w-[150px]">
                        {user.email}
                      </p>
                    </div>
                    <HiChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-1" />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute  right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none z-50">
                    <>
                      {/* Authenticated User Menu */}
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-700">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
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

                      {/* Additional Options for Authenticated Users */}
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                router.push("/dashboard/add-listing")
                              }
                              className={clsx(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                              )}
                            >
                              <UserPlus className="mr-3 h-4 w-4" />
                              Become a Host
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                /* Add help center logic */
                              }}
                              className={clsx(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                              )}
                            >
                              <HelpCircle className="mr-3 h-4 w-4" />
                              Help Center
                            </button>
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
                    </>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/signin"
                  className="px-7 py-2 rounded-full text-black text-sm font-semibold hover:bg-black/5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-7 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-black/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    router.push("/cart");
                  }}
                  className="text-gray-700 hover:text-gray-900 p-2 relative cursor-pointer transition-colors"
                >
                  <Image
                    src="/images/cart.svg"
                    alt="Cart"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                </button>
              </div>
            )}

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

              {isAuthenticated ? (
                <>
                  <div
                    onClick={() => {
                      router.push("/cart");
                    }}
                    className="px-3 py-2 text-left md:text-center bg-gray-50 rounded-md"
                  >
                    <span className="text-sm font-semibold text-gray-700">
                      Total: RWF {totalPrice}
                    </span>
                  </div>
                  {/* User Info in Mobile */}
                  <div className="px-3 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
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
