import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import authService from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/shared/ToastProvider";
import { useChangePasswordMutation } from "@/hooks/use-userConfidentails";

export default function SecuritySettings() {
  const { user, setUser } = useAuth();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const enable2FAMutation = useMutation({
    mutationFn: async () => {
      return await authService.enable2FA();
    },
    onSuccess: (response) => {
      if (user) {
        setUser({ ...user, is2fa: true });
      }
      showSuccessToast(
        "Two-Factor Authentication enabled",
        response.data.message
      );
    },
    onError: (error: Error) => {
      console.error("2FA Enable error:", error);
    },
  });

  const changePasswordMutation = useChangePasswordMutation(user?.id, {
    onSuccess: (data) => {
      showSuccessToast(
        "Password updated",
        data.message ?? "Your password has been updated."
      );
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordError(null);
    },
    onError: (message: string) => {
      setPasswordError(message);
      showErrorToast("Password update failed", message);
    },
  });

  const toggleVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange =
    (field: keyof typeof passwordForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setPasswordForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const validatePasswords = () => {
    if (
      !passwordForm.currentPassword.trim() ||
      !passwordForm.newPassword.trim() ||
      !passwordForm.confirmPassword.trim()
    ) {
      return "Please fill in all password fields.";
    }

    if (passwordForm.newPassword.length < 8) {
      return "New password must be at least 8 characters long.";
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      return "New password must be different from the current password.";
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return "New password and confirmation do not match.";
    }

    return null;
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validatePasswords();
    if (validationError) {
      setPasswordError(validationError);
      showErrorToast("Password update failed", validationError);
      return;
    }
    setPasswordError(null);
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const saveDisabled =
    changePasswordMutation.isPending ||
    !passwordForm.currentPassword ||
    !passwordForm.newPassword ||
    !passwordForm.confirmPassword;

  return (
    <div className="space-y-6">
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
            Change Password
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Ensure your password is unique and contains at least one number or
            symbol to keep your rentals secure.
          </p>
        </div>

        <div className="space-y-4">
          {(
            [
              {
                id: "currentPassword",
                label: "Current password",
                placeholder: "Enter your current password",
                field: "current" as const,
              },
              {
                id: "newPassword",
                label: "New password",
                placeholder: "At least 8 characters",
                field: "next" as const,
              },
              {
                id: "confirmPassword",
                label: "Confirm new password",
                placeholder: "Re-enter your new password",
                field: "confirm" as const,
              },
            ] as const
          ).map((input) => (
            <div key={input.id}>
              <label
                htmlFor={input.id}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {input.label}
              </label>
              <div className="relative">
                <input
                  id={input.id}
                  type={passwordVisibility[input.field] ? "text" : "password"}
                  placeholder={input.placeholder}
                  value={passwordForm[input.id as keyof typeof passwordForm]}
                  onChange={handlePasswordChange(
                    input.id as keyof typeof passwordForm
                  )}
                  autoComplete={
                    input.id === "currentPassword" ? "current-password" : "new-password"
                  }
                  className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility(input.field)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label={`Toggle ${input.label} visibility`}
                >
                  {passwordVisibility[input.field] ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {passwordError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {passwordError}
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gray-500" />
            <span>Updating your password signs you out of other devices.</span>
          </div>
          <span className="text-xs text-gray-400">
            Last updated {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "recently"}
          </span>
        </div>

        <div className="flex justify-end border-t border-gray-200 pt-4">
          <button
            type="submit"
            disabled={saveDisabled}
            className="flex items-center space-x-2 px-4 md:px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            <span className="text-sm md:text-base">
              {changePasswordMutation.isPending ? "Updating..." : "Save Password"}
            </span>
          </button>
        </div>
      </form>

      <div className="border-t pt-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Two-Factor Authentication
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
          <div>
            <p className="font-medium text-gray-900">Enable 2FA</p>
            <p className="text-sm text-gray-600">
              Add an extra layer of security to your account
            </p>
          </div>

          {user && (
            <button
              disabled={user.is2fa || enable2FAMutation.isPending}
              className={`${user.is2fa
                ? "bg-gray-300 text-gray-400"
                : "bg-gray-700 text-white"
                } px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer disabled:cursor-not-allowed`}
              onClick={() => enable2FAMutation.mutate()}
            >
              {user.is2fa ? "Enabled" : enable2FAMutation.isPending ? "Enabling..." : "Enable"}
            </button>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
        <button className="flex items-center space-x-2 px-4 md:px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm md:text-base">Save Changes</span>
        </button>
      </div>
    </div>
  );
}
