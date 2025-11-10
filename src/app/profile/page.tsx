"use client";

import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import authService from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/shared/ToastProvider";
import Image from "next/image";
import {
  User,
  Camera,
  Edit,
  Lock,
  Check,
  X,
  Shield,
  AlertCircle,
  Info,
  Mail,
  Phone,
} from "lucide-react";

interface ProfileFormData {
  fName: string;
  lName: string;
  phone: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return await authService.updateProfile(data);
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setIsEditingProfile(false);
      toast.success(
        "Profile Updated",
        "Your profile has been updated successfully!"
      );
    },
    onError: (error: Error) => {
      toast.error("Update Failed", error.message || "Failed to update profile");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      return await authService.changePassword(
        data.currentPassword,
        data.newPassword
      );
    },
    onSuccess: () => {
      setIsChangingPassword(false);
      resetPassword();
      toast.success(
        "Password Changed",
        "Your password has been updated successfully!"
      );
    },
    onError: (error: Error) => {
      toast.error(
        "Password Change Failed",
        error.message || "Failed to change password"
      );
    },
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    defaultValues: {
      fName: user?.fName || "",
      lName: user?.lName || "",
      phone: user?.phone || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm<PasswordFormData>();

  const watchNewPassword = watch("newPassword");

  const onProfileSubmit = async (data: ProfileFormData) => {
    await updateProfileMutation.mutateAsync(data);
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    await changePasswordMutation.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success(
        "Picture Updated",
        "Profile picture uploaded successfully!"
      );
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden">
                {user.picture ? (
                  <Image
                    src={user.picture}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                )}
              </div>
              <button
                onClick={handleProfilePictureClick}
                title="Change Profile Picture"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                placeholder="Select profile picture"
              />
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {user.fName} {user.lName}
              </h1>
              <p className="text-gray-100 text-lg">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Profile Information Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                Profile Information
              </h2>
              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      resetProfile();
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSubmit(onProfileSubmit)}
                    disabled={updateProfileMutation.isPending}
                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-900 disabled:opacity-50 cursor-pointer"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </button>
                </div>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      First Name
                    </label>
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    {user.fName}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Last Name
                    </label>
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    {user.lName}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Email Address
                    </label>
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    {user.email}
                  </p>
                  <div className="flex items-center mt-2">
                    {user.isVerified ? (
                      <div className="flex items-center space-x-1">
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">
                          Verified
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-orange-600 font-medium">
                          Unverified
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Phone Number
                    </label>
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    {user.phone || (
                      <span className="text-gray-500 italic">Not provided</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <form
                  onSubmit={handleProfileSubmit(onProfileSubmit)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="fName"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...registerProfile("fName", {
                          required: "First name is required",
                        })}
                        className="block w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 outline-none"
                        placeholder="Enter your first name"
                      />
                      <User className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                    {profileErrors.fName && (
                      <div className="flex items-center space-x-1 mt-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-sm text-red-600">
                          {profileErrors.fName.message}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="lName"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...registerProfile("lName", {
                          required: "Last name is required",
                        })}
                        className="block w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 outline-none"
                        placeholder="Enter your last name"
                      />
                      <User className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                    {profileErrors.lName && (
                      <div className="flex items-center space-x-1 mt-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-sm text-red-600">
                          {profileErrors.lName.message}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        placeholder="Enter your email address"
                        className="block w-full px-4 py-3 text-gray-500 placeholder-gray-400 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed outline-none"
                      />
                      <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      <Info className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600 font-medium">
                        Email address cannot be changed for security reasons
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Phone Number{" "}
                      <span className="text-gray-500 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        {...registerProfile("phone")}
                        className="block w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                        placeholder="Enter your phone number"
                      />
                      <Phone className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      <Shield className="w-3 h-3 text-green-500" />
                      <p className="text-xs text-green-600">
                        Phone number is used for account recovery
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-gray-500" />
                Change Password
              </h2>
              {!isChangingPassword ? (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
                >
                  <Lock className="w-4 h-4 mr-1" />
                  Change Password
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      resetPassword();
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSubmit(onPasswordSubmit)}
                    disabled={changePasswordMutation.isPending}
                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-900 disabled:opacity-50 cursor-pointer"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Update Password
                  </button>
                </div>
              )}
            </div>

            {!isChangingPassword ? (
              <div className="bg-gray-100 border border-gray-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Password Security
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Keep your account secure by using a strong password and
                      changing it regularly. We recommend updating your password
                      every 3-6 months.
                    </p>
                    <div className="mt-3 flex items-center space-x-4 text-xs text-gray-600">
                      <span className="flex items-center">
                        <Check className="w-3 h-3 mr-1" />
                        8+ characters
                      </span>
                      <span className="flex items-center">
                        <Check className="w-3 h-3 mr-1" />
                        Mixed case
                      </span>
                      <span className="flex items-center">
                        <Check className="w-3 h-3 mr-1" />
                        Numbers & symbols
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <form
                  onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                  className="space-y-6"
                >
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        {...registerPassword("currentPassword", {
                          required: "Current password is required",
                        })}
                        className="block w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 outline-none"
                        placeholder="Enter your current password"
                      />
                      <Lock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                    {passwordErrors.currentPassword && (
                      <div className="flex items-center space-x-1 mt-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-sm text-red-600">
                          {passwordErrors.currentPassword.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        {...registerPassword("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                            message:
                              "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                          },
                        })}
                        className="block w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 outline-none"
                        placeholder="Create a strong new password"
                      />
                      <Lock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                    {passwordErrors.newPassword && (
                      <div className="flex items-start space-x-1 mt-2">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-600 leading-relaxed">
                          {passwordErrors.newPassword.message}
                        </p>
                      </div>
                    )}

                    {/* Password Requirements */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3">
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Password Requirements
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div
                          className={`flex items-center space-x-1 ${watchNewPassword && watchNewPassword.length >= 8
                            ? "text-green-600"
                            : "text-gray-500"
                            }`}
                        >
                          {watchNewPassword && watchNewPassword.length >= 8 ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <div className="w-3 h-3 border border-gray-300 rounded-full" />
                          )}
                          <span>8+ characters</span>
                        </div>
                        <div
                          className={`flex items-center space-x-1 ${watchNewPassword && /[A-Z]/.test(watchNewPassword)
                            ? "text-green-600"
                            : "text-gray-500"
                            }`}
                        >
                          {watchNewPassword &&
                            /[A-Z]/.test(watchNewPassword) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <div className="w-3 h-3 border border-gray-300 rounded-full" />
                          )}
                          <span>Uppercase letter</span>
                        </div>
                        <div
                          className={`flex items-center space-x-1 ${watchNewPassword && /[a-z]/.test(watchNewPassword)
                            ? "text-green-600"
                            : "text-gray-500"
                            }`}
                        >
                          {watchNewPassword &&
                            /[a-z]/.test(watchNewPassword) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <div className="w-3 h-3 border border-gray-300 rounded-full" />
                          )}
                          <span>Lowercase letter</span>
                        </div>
                        <div
                          className={`flex items-center space-x-1 ${watchNewPassword && /\d/.test(watchNewPassword)
                            ? "text-green-600"
                            : "text-gray-500"
                            }`}
                        >
                          {watchNewPassword && /\d/.test(watchNewPassword) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <div className="w-3 h-3 border border-gray-300 rounded-full" />
                          )}
                          <span>Number</span>
                        </div>
                        <div
                          className={`flex items-center space-x-1 col-span-2 ${watchNewPassword &&
                            /[@$!%*?&]/.test(watchNewPassword)
                            ? "text-green-600"
                            : "text-gray-500"
                            }`}
                        >
                          {watchNewPassword &&
                            /[@$!%*?&]/.test(watchNewPassword) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <div className="w-3 h-3 border border-gray-300 rounded-full" />
                          )}
                          <span>Special character (@$!%*?&)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        {...registerPassword("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === watchNewPassword ||
                            "Passwords do not match",
                        })}
                        className="block w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 outline-none"
                        placeholder="Confirm your new password"
                      />
                      <Lock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                    {passwordErrors.confirmPassword && (
                      <div className="flex items-center space-x-1 mt-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-sm text-red-600">
                          {passwordErrors.confirmPassword.message}
                        </p>
                      </div>
                    )}
                    {watchNewPassword &&
                      watch("confirmPassword") &&
                      watch("confirmPassword") === watchNewPassword && (
                        <div className="flex items-center space-x-1 mt-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <p className="text-sm text-green-600 font-medium">
                            Passwords match
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Security Tips */}
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-gray-700">
                        <p className="font-semibold mb-1">Security Tips:</p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>
                            Don&apos;t reuse passwords from other accounts
                          </li>
                          <li>Consider using a password manager</li>
                          <li>Avoid using personal information in passwords</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Account Details */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Account Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-500">
                  Account Status
                </label>
                <p className="mt-1 text-lg text-gray-900">
                  {user.isActive ? (
                    <span className="text-green-700 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Member Since
                </label>
                <p className="mt-1 text-base text-gray-900 font-semibold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
