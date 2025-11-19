"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import authService from "@/services/auth.service";
import { useToast } from "@/app/shared/ToastProvider";

type ResetPasswordForm = {
  otp: string;
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<ResetPasswordForm>({
    mode: "onChange", // Enable real-time validation
  });

  const password = watch("password");
  const otpLength = 6;
  const [otpValues, setOtpValues] = useState<string[]>(
    () => new Array(otpLength).fill("")
  );
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    register("otp", {
      required: "OTP is required",
      validate: validateOTP,
    });
  }, [register]);

  useEffect(() => {
    setValue("otp", otpValues.join(""), { shouldValidate: true });
  }, [otpValues, setValue]);

  // Debug form state
  console.log("Form errors:", errors);
  console.log("Form is valid:", isValid);

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(value)) {
      return "Password must contain at least one number";
    }
    if (!/(?=.*[@$!%*?&])/.test(value)) {
      return "Password must contain at least one special character (@$!%*?&)";
    }
    return true;
  };

  const validateConfirmPassword = (value: string) => {
    if (value !== password) {
      return "Passwords do not match";
    }
    return true;
  };

  const validateOTP = (value: string) => {
    if (!/^\d{6}$/.test(value)) {
      return "OTP must be exactly 6 digits";
    }
    return true;
  };

  const onSubmit = async (data: ResetPasswordForm) => {

    // Additional validation check
    if (!data.otp || !data.password) {
      error("Validation Error", "Please fill in all required fields");
      return;
    }

    if (data.otp.length !== 6) {
      error("Invalid OTP", "OTP must be exactly 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPasswordWithOTP(data.otp, data.password);
      success(
        "Password Reset Successful",
        "Password reset successfully! You can now sign in with your new password."
      );

      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMessage =
        (err as Error)?.message ||
        "Failed to reset password. Please check your OTP and try again.";
      error("Reset Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the OTP code sent to your email and create a new password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <div className="space-y-6">
              {/* OTP Field */}
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter OTP Code
                </label>
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    {otpValues.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                          return undefined;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length > 1) return;
                          const updatedOtp = [...otpValues];
                          updatedOtp[index] = value;
                          setOtpValues(updatedOtp);
                          if (value && index < otpLength - 1) {
                            otpRefs.current[index + 1]?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !otpValues[index]) {
                            if (index > 0) {
                              otpRefs.current[index - 1]?.focus();
                            }
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData = e.clipboardData
                            .getData("text/plain")
                            .replace(/\D/g, "")
                            .slice(0, otpLength);
                          if (!pastedData) return;

                          const updatedOtp = new Array(otpLength).fill("");
                          for (let i = 0; i < pastedData.length; i++) {
                            updatedOtp[i] = pastedData[i];
                          }
                          setOtpValues(updatedOtp);
                          const focusIndex = Math.min(
                            pastedData.length,
                            otpLength - 1
                          );
                          otpRefs.current[focusIndex]?.focus();
                        }}
                        className="w-10 h-10 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold border border-gray-200 rounded-lg bg-gray-50 focus:ring-1 focus:ring-gray-700 focus:border-gray-900 transition-all tracking-widest"
                        aria-label={`OTP digit ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.otp.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {/* New Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      validate: validatePassword,
                    })}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-gray-700 focus:border-gray-800 sm:text-sm"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: validateConfirmPassword,
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-gray-700 focus:border-gray-800 sm:text-sm"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Password requirements:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character (@$!%*?&)</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </button>

                <Link
                  href="/auth/signin"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
