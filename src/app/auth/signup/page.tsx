"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import authService from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/shared/ToastProvider";
import Link from "next/link";
import LeftSide from "@/components/auth/LeftSide";

interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function SignUpPage() {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, setUser, setIsAuthenticated } = useAuth();

  const registerMutation = useMutation({
    mutationFn: async (userData: {
      fName: string;
      lName: string;
      email: string;
      password: string;
      isTermsAccepted: boolean;
    }) => {
      return await authService.register(userData);
    },
    onSuccess: (data) => {
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success(
        "Account Created!",
        "Your account has been successfully created."
      );
      router.push("/auth/verify-email");
    },
    onError: (error: Error) => {
      toast.error("Registration Failed", error.message || "Registration failed");
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>();

  const password = watch("password");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: SignUpForm) => {
    try {
      await registerMutation.mutateAsync({
        fName: data.firstName,
        lName: data.lastName,
        email: data.email,
        password: data.password,
        isTermsAccepted: data.agreeToTerms,
      });
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <LeftSide isSignInPage={false} />

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create an account
            </h2>
            <p className="text-gray-600">
              Enter your details to proceed with your account
            </p>
          </div>

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="email@gmail.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Firstname"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>
                <input
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Lastname"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="••••••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="••••••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3">
              <div className="relative mt-0.5">
                <input
                  {...register("agreeToTerms", {
                    required: "You must agree to the terms and conditions",
                  })}
                  type="checkbox"
                  className="w-5 h-5 text-black bg-white border border-gray-300 rounded cursor-pointer transition-all duration-200 ease-in-out focus:ring-1 focus:ring-black focus:ring-offset-1 hover:border-gray-400 checked:bg-black checked:border-black checked:text-white accent-black"
                  id="agreeToTerms"
                />
              </div>
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-gray-600 cursor-pointer leading-relaxed"
              >
                I agree with{" "}
                <Link
                  href="/terms"
                  className="text-black font-medium underline hover:text-gray-700 transition-colors"
                >
                  terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/conditions"
                  className="text-black font-medium underline hover:text-gray-700 transition-colors"
                >
                  conditions
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600">
                {errors.agreeToTerms.message}
              </p>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || registerMutation.isPending}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isSubmitting || registerMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </button>

            {/* Or Continue With */}
            <div className="text-center">
              <span className="text-gray-500 text-sm">or continue with</span>
            </div>

            {/* Google Sign Up Button */}
            <button
              type="button"
              className="w-full cursor-pointer bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Mobile Sign In Link */}
          <div className="mt-8 text-center lg:hidden">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-medium text-black hover:text-gray-800"
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
