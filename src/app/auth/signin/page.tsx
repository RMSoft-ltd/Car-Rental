"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import authService from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/shared/ToastProvider";
import Link from "next/link";
import {
  ArrowLeft,
  Car,
  Lock,
  CheckCircle,
  Sparkles,
  Route,
  MapPin,
  Clock,
  Star,
  Users,
  ShieldCheck,
  BadgeCheck,
  Zap,
  Globe,
  Award,
  Key,
  Mail,
} from "lucide-react";
import { ApiError } from "@/types/Api";
import {
  AuthResponse,
  LoginRequest,
  LoginResult,
  TwoFactorChallenge,
} from "@/types/auth";
import { TwoFactorModal } from "@/components/auth/TwoFactorModal";

interface SignInForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const isTwoFactorChallenge = (
  result: LoginResult
): result is TwoFactorChallenge => {
  return (
    typeof result === "object" &&
    result !== null &&
    "requiresTwoFactor" in result &&
    Boolean((result as TwoFactorChallenge).requiresTwoFactor)
  );
};

export default function SignInPage() {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, setUser, setIsAuthenticated } = useAuth();
  const [twoFactorState, setTwoFactorState] = useState<{
    open: boolean;
    token?: string;
    message?: string;
    email?: string;
  }>({ open: false });
  const [lastLoginEmail, setLastLoginEmail] = useState("");
  const [lastCredentials, setLastCredentials] = useState<LoginRequest | null>(
    null
  );

  const loginMutation = useMutation<LoginResult, ApiError, LoginRequest>({
    mutationFn: async (credentials) => {
      return await authService.login(credentials);
    },
    onSuccess: (data) => {
      if (isTwoFactorChallenge(data)) {
        setTwoFactorState({
          open: true,
          token: data.twoFactorToken,
          message: data.message,
          email: lastLoginEmail,
        });
        toast.info(
          "Verification required",
          data.message || "Enter the verification code we sent to your email."
        );
        return;
      }

      setUser(data.user);
      setIsAuthenticated(true);
      toast.success("Welcome back!", "You have been successfully signed in.");
      router.push("/");
    },
    onError: (error) => {
      toast.error("Sign In Failed", error.message || "Invalid credentials");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: SignInForm) => {
    setLastLoginEmail(data.email);
    setLastCredentials({
      email: data.email,
      password: data.password,
    });
    try {
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const handleResendTwoFactorCode = async () => {
    if (!lastCredentials) {
      toast.warning(
        "Missing credentials",
        "Please re-enter your email and password to request a new code."
      );
      return;
    }
    try {
      const result = await authService.login(lastCredentials);
      if (isTwoFactorChallenge(result)) {
        setTwoFactorState((prev) => ({
          ...prev,
          token: result.twoFactorToken,
          message: result.message,
        }));
        toast.info(
          "Verification code resent",
          result.message || "Check your email for the new verification code."
        );
        return;
      }

      setTwoFactorState({ open: false });
      setUser(result.user);
      setIsAuthenticated(true);
      toast.success("Welcome back!", "You have been successfully signed in.");
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to resend verification code. Please try again.";
      toast.error("Resend failed", message);
    }
  };

  return (
    <>
      <div className="min-h-screen flex bg-white">
      {/* Left Side - Enhanced */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          {/* Enhanced Icon Grid */}
          <div className="grid grid-cols-4 gap-8 mb-16">
            {/* Row 1 */}
            <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center group hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-6">
              <Car className="w-8 h-8 text-white group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center group hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:-rotate-6">
              <Route className="w-8 h-8 text-white group-hover:text-green-400 transition-colors" />
            </div>
            <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center group hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-12">
              <MapPin className="w-8 h-8 text-white group-hover:text-red-400 transition-colors" />
            </div>
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center group hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:-rotate-12">
              <Clock className="w-8 h-8 text-white group-hover:text-yellow-400 transition-colors" />
            </div>

            {/* Row 2 */}
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center group hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:-rotate-6">
              <ShieldCheck className="w-8 h-8 text-white group-hover:text-purple-400 transition-colors" />
            </div>
            <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center group hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-6">
              <Star className="w-8 h-8 text-white group-hover:text-amber-400 transition-colors" />
            </div>
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center group hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:-rotate-12">
              <Users className="w-8 h-8 text-white group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center group hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-12">
              <Zap className="w-8 h-8 text-white group-hover:text-orange-400 transition-colors" />
            </div>

            {/* Row 3 */}
            <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center group hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-6">
              <Globe className="w-8 h-8 text-white group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center group hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:-rotate-6">
              <Award className="w-8 h-8 text-white group-hover:text-pink-400 transition-colors" />
            </div>
            <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center group hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-12">
              <BadgeCheck className="w-8 h-8 text-white group-hover:text-indigo-400 transition-colors" />
            </div>
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center group hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:-rotate-12">
              <Sparkles className="w-8 h-8 text-white group-hover:text-yellow-300 transition-colors" />
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-6">
             
              <h1 className="text-4xl font-bold text-white">
                Drive your way, rent with ease.
              </h1>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-12 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              A modern car rental platform that offers customers flexible
              vehicle options with the choice of professional drivers. Whether
              for business, travel, or daily use, it ensures convenience,
              safety, and comfort in every journey.
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-sm text-gray-300 font-medium">Secure</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm text-gray-300 font-medium">Verified</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm text-gray-300 font-medium">Trusted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative z-10 flex items-center justify-between bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
          <div>
            <span className="text-gray-300 block text-sm">You don&apos;t have an account?</span>
            <span className="text-white font-semibold block text-sm">Join thousands of car renters</span>
          </div>
          <Link
            href="/auth/signup"
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Right Side - Enhanced Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          {/* Enhanced Header */}
          <div className="mb-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-black rounded-2xl shadow-lg">
                <Key className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-lg">
              Sign in to continue your journey
            </p>
          </div>

          <div className="space-y-6">
            {/* Enhanced Email Field */}
            <div className="group">
              <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-300 bg-white group-hover:border-gray-300"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Enhanced Password Field */}
            <div className="group">
              <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type="password"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-300 bg-white group-hover:border-gray-300"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <Lock className="w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
                </div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Enhanced Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center group cursor-pointer">
                <div className="relative">
                  <input
                    {...register("rememberMe")}
                    type="checkbox"
                    className="sr-only"
                    id="rememberMe"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-lg group-hover:border-black transition-colors duration-300 flex items-center justify-center mr-3 bg-white">
                      <CheckCircle className="w-4 h-4 text-white transition-all duration-300 transform scale-0 peer-checked:scale-100" />
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      Remember me
                    </span>
                  </label>
                </div>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-semibold text-black hover:text-gray-700 transition-all duration-300 cursor-pointer flex items-center gap-1 group"
              >
                Forgot Password?
                <ArrowLeft className="w-4 h-4 transform rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Enhanced Submit Button */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || loginMutation.isPending}
              className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              {isSubmitting || loginMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Sign In to Account
                </>
              )}
            </button>

            {/* Enhanced Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Enhanced Google Button */}
            <button
              type="button"
              className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-sm hover:shadow flex items-center justify-center gap-3 group"
            >
              <div className="p-2 rounded-lg bg-white group-hover:bg-gray-50 transition-colors duration-300">
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
              </div>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Enhanced Mobile Sign Up Link */}
          <div className="mt-12 text-center lg:hidden">
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
              <span className="text-sm text-gray-600 block mb-3">
                Don&apos;t have an account?
              </span>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 font-semibold text-black hover:text-gray-700 transition-all duration-300 cursor-pointer text-lg group"
              >
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Join us today
                <ArrowLeft className="w-4 h-4 transform rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
      <TwoFactorModal
        open={twoFactorState.open}
        email={twoFactorState.email}
        message={twoFactorState.message}
        verificationToken={twoFactorState.token}
        onClose={() =>
          setTwoFactorState((prev) => ({
            ...prev,
            open: false,
          }))
        }
        onVerified={(response: AuthResponse) => {
          setTwoFactorState({ open: false });
          setUser(response.user);
          setIsAuthenticated(true);
          toast.success("Welcome back!", "Two-factor verification successful.");
          router.push("/");
        }}
        onResendCode={handleResendTwoFactorCode}
      />
    </>
  );
}