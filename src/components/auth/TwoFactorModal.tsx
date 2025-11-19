"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ShieldCheck, Mail, Clock4 } from "lucide-react";
import { useTwoFactorVerification } from "@/hooks/use-two-factor";
import { AuthResponse } from "@/types/auth";
import { useToast } from "@/app/shared/ToastProvider";

const DEFAULT_CODE_LENGTH = 6;
const RESEND_COOLDOWN = 180;

interface TwoFactorModalProps {
  open: boolean;
  email?: string;
  message?: string;
  verificationToken?: string;
  onClose: () => void;
  onVerified: (response: AuthResponse) => void;
  codeLength?: number;
  onResendCode?: () => Promise<void> | void;
}

export function TwoFactorModal({
  open,
  email,
  message,
  verificationToken,
  onClose,
  onVerified,
  codeLength = DEFAULT_CODE_LENGTH,
  onResendCode,
}: TwoFactorModalProps) {
  const toast = useToast();
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [isResending, setIsResending] = useState(false);

  const verificationMutation = useTwoFactorVerification({
    onSuccess: (response) => {
      setOtp("");
      onVerified(response);
    },
    onError: (errorMessage) => {
      toast.error("Verification failed", errorMessage);
    },
  });

  useEffect(() => {
    if (!open) {
      setOtp("");
      setCooldown(RESEND_COOLDOWN);
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [open]);

  const obfuscatedEmail = useMemo(() => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const safeLocal =
      local.length <= 2
        ? `${local[0] ?? ""}*`
        : `${local.slice(0, 2)}${"*".repeat(Math.max(local.length - 2, 1))}`;
    return `${safeLocal}@${domain}`;
  }, [email]);

  const canSubmit = otp.length === codeLength && !verificationMutation.isPending;

  const helperMessage =
    message || "Enter the verification code we emailed to finish signing in.";

  const minutes = Math.floor(cooldown / 60);
  const seconds = cooldown % 60;
  const formattedCountdown = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const handleSubmit = () => {
    if (!canSubmit) return;
    verificationMutation.mutate({
      otp,
      token: verificationToken ?? "",
    });
  };

  const handleResend = async () => {
    if (!onResendCode || cooldown > 0 || isResending) return;
    try {
      setIsResending(true);
      await onResendCode();
      setCooldown(RESEND_COOLDOWN);
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !verificationMutation.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 overflow-hidden shadow-2xl sm:max-w-md">
        <div className="bg-gradient-to-b from-black to-gray-900 px-6 py-5 text-white">
          <DialogHeader className="text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/10">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm uppercase tracking-[0.2em] text-white/70">
                Two-Step Verification
              </span>
            </div>
            <DialogTitle className="text-2xl text-white">
              Secure your account
            </DialogTitle>
            <DialogDescription className="text-white/80">
              {helperMessage}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-inner">
              <Mail className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">We sent a code to</p>
              <p className="text-base font-semibold text-gray-900">
                {obfuscatedEmail || "your email address"}
              </p>
            </div>
          </div>

          <div className="space-y-2 px-1">
            <label className="text-sm font-semibold text-gray-700">
              Enter {codeLength}-digit code
            </label>
            <InputOTP
              value={otp}
              onChange={setOtp}
              maxLength={codeLength}
              containerClassName="w-full"
            >
              <InputOTPGroup className="gap-2 w-full px-0.5">
                {Array.from({ length: codeLength }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-14 flex-1 min-w-[50px] text-lg font-semibold rounded-xl bg-white border-2 border-gray-200 data-[active=true]:border-black/80 data-[active=true]:ring-2 data-[active=true]:ring-black/10 transition-all first:ml-1 last:mr-1"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock4 className="w-4 h-4" />
              <span>
                Code expires in{" "}
                <span className="font-semibold text-gray-800">
                  {formattedCountdown}
                </span>
              </span>
            </div>
            <button
              type="button"
              className="font-semibold text-black disabled:text-gray-300 cursor-pointer hover:text-gray-700 transition-colors"
              disabled={cooldown > 0 || isResending}
              onClick={handleResend}
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 cursor-pointer hover:text-gray-700 transition-colors"
              onClick={onClose}
              disabled={verificationMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-black hover:bg-black/90 cursor-pointer"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {verificationMutation.isPending ? "Verifying..." : "Verify & Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

