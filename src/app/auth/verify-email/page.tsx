"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import authService from "@/services/auth.service";
import { useToast } from "@/app/shared/ToastProvider";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useToast();
  const lastTokenRef = useRef<string | null>(null);
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("No verification token provided.");
        return;
      }

      if (lastTokenRef.current === token) {
        return;
      }
      lastTokenRef.current = token;

      try {
        await authService.verifyEmail(token);
        setStatus("success");
        success(
          "Email Verified",
          "Email verified successfully! You can now sign in."
        );

        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      } catch (err) {
        setStatus("error");
        const errorMsg =
          (err as Error)?.message ||
          "Failed to verify email. The token may be invalid or expired.";
        setErrorMessage(errorMsg);
        error("Verification Failed", errorMsg);
      }
    };

    verifyToken();
  }, [token, router, success, error]);

  const handleReturnToSignIn = () => {
    router.push("/auth/signin");
  };

  return (
    <div className="bg-white py-8 px-6 shadow-lg rounded-xl">
      <div className="flex flex-col items-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 text-gray-800 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900">
              Verifying your email...
            </h3>
            <p className="text-gray-600 text-center">
              This should only take a moment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Email Verified Successfully!
            </h3>
            <p className="text-gray-600 text-center">
              Your email has been verified. You will be redirected to the sign
              in page shortly.
            </p>
            <div className="mt-4">
              <button
                onClick={handleReturnToSignIn}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Continue to Sign In
              </button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-red-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Verification Failed
            </h3>
            <p className="text-gray-600 text-center">{errorMessage}</p>
            <div className="mt-4 space-y-2">
              <button
                onClick={handleReturnToSignIn}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-gray-500 transition-colors cursor-pointer"
              >
                Return to Sign In
              </button>
              <p className="text-xs text-gray-500 text-center">
                Need help? Contact support for assistance.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function VerifyEmailLoading() {
  return (
    <div className="bg-white py-8 px-6 shadow-lg rounded-xl">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-16 w-16 text-gray-800 animate-spin" />
        <h3 className="text-lg font-medium text-gray-900">
          Preparing email verification...
        </h3>
        <p className="text-gray-600 text-center">Please wait a moment.</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we verify your email address
          </p>
        </div>

        <Suspense fallback={<VerifyEmailLoading />}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
