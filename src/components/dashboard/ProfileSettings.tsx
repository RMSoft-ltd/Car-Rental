
"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Mail,
  Phone,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { LuCamera } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/shared/ToastProvider";
import {
  useConfidentialInfoMutation,
  useUpdateUserDetailsMutation,
  useUserDetailsQuery,
} from "@/hooks/use-userConfidentails";
import { ConfidentialInfoForm } from "./ConfidentialInfoForm";
import { ConfidentialInfoSkeleton } from "./ConfidentialInfoSkeleton";
import { getErrorMessage } from "@/utils/error-utils";
import type { ConfidentialInfoPayload } from "@/types/user";

export default function ProfileSettings() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [basicForm, setBasicForm] = useState({
    fName: "",
    lName: "",
    phone: "",
  });
  const [basicError, setBasicError] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useUserDetailsQuery(user?.id, {
    enabled: Boolean(user?.id),
  });

  const mutation = useConfidentialInfoMutation(user?.id, {
    onSuccess: () => {
      toast.success(
        "Profile updated",
        "Your confidential information has been saved."
      );
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["userDetails", user.id] });
      }
    },
    onError: (err) => {
      toast.error("Update failed", getErrorMessage(err));
    },
  });

  const serverError = mutation.error
    ? getErrorMessage(mutation.error, "Failed to save profile.")
    : null;

  const updateUserMutation = useUpdateUserDetailsMutation(user?.id, {
    onSuccess: () => {
      toast.success("Profile updated", "Your account details have been saved.");
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["userDetails", user.id] });
      }
    },
    onError: (err) => {
      toast.error("Update failed", getErrorMessage(err));
    },
  });

  const profile = data?.user ?? null;
  const confidentialInfo = data?.confidentialInfo ?? null;

  useEffect(() => {
    if (!profile) return;
    setBasicForm({
      fName: profile.fName ?? "",
      lName: profile.lName ?? "",
      phone: profile.phone ?? "",
    });
  }, [profile]);

  const profilePicture = useMemo(() => {
    if (!profile?.picture) return null;
    if (profile.picture.startsWith("http")) {
      return profile.picture;
    }
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${profile.picture}`;
  }, [profile?.picture]);

  const summaryBadges = useMemo(() => {
    if (!profile) return [];
    const badges: Array<{ label: string; color: string }> = [];
    if (profile.isVerified) {
      badges.push({
        label: "Verified",
        color: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      });
    }
    if (profile.is2fa) {
      badges.push({
        label: "2FA enabled",
        color: "bg-gray-100 text-gray-700 border border-gray-200",
      });
    }
    if (!profile.isActive) {
      badges.push({
        label: "Inactive account",
        color: "bg-red-100 text-red-700 border border-red-200",
      });
    }
    return badges;
  }, [profile]);

  const formattedLastUpdated = useMemo(() => {  
    const updatedAt = confidentialInfo?.updatedAt ?? profile?.updatedAt;
    if (!updatedAt) return null;
    return new Date(updatedAt).toLocaleString();
  }, [confidentialInfo?.updatedAt, profile?.updatedAt]);

  const hasBasicChanges = useMemo(() => {
    if (!profile) return false;
    return (
      basicForm.fName !== (profile.fName ?? "") ||
      basicForm.lName !== (profile.lName ?? "") ||
      basicForm.phone !== (profile.phone ?? "")
    );
  }, [basicForm, profile]);

  const handleSubmit = (
    values: ConfidentialInfoPayload & { recordId?: number }
  ) => {
    mutation.mutate(values);
  };

  const handleBasicInputChange =
    (field: keyof typeof basicForm) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setBasicForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleBasicSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!basicForm.fName.trim() || !basicForm.lName.trim()) {
      setBasicError("First and last name are required.");
      return;
    }
    setBasicError(null);
    updateUserMutation.mutate({
      fName: basicForm.fName.trim(),
      lName: basicForm.lName.trim(),
      phone: basicForm.phone.trim() || null,
    });
  };

  if (!user?.id) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Please sign in to view your profile settings.
      </div>
    );
  }

  if (isLoading) {
    return <ConfidentialInfoSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Failed to load profile information:{" "}
        {getErrorMessage(error, "Unable to fetch profile data.")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100">
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt="Profile picture"
                  fill
                  className="object-cover"
                />
              ) : (
                <UserIcon className="h-8 w-8 text-gray-500" />
              )}
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white shadow"
                aria-label="Update profile picture"
              >
                <LuCamera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.fName} {profile.lName}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {summaryBadges.length === 0 ? (
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    Profile in progress
                  </span>
                ) : (
                  summaryBadges.map((badge) => (
                    <span
                      key={badge.label}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.color}`}
                    >
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      {badge.label}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {formattedLastUpdated ? (
              <>
                Last updated{" "}
                <span className="font-semibold text-gray-700 text-nowrap">
                  {formattedLastUpdated}
                </span>
              </>
            ) : (
              <span>Complete your profile to unlock full access.</span>
            )}
            {isFetching && !isLoading && (
              <span className="ml-2 text-xs text-gray-400">Refreshing…</span>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleBasicSubmit}
        className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Account Information
            </h3>
            <p className="text-sm text-gray-500">
              Update how your name and contact appear across the dashboard.
            </p>
          </div>
          {isFetching && !isLoading && (
            <span className="text-xs text-gray-400">Syncing…</span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              First name
            </label>
            <input
              type="text"
              value={basicForm.fName}
              onChange={handleBasicInputChange("fName")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              type="text"
              value={basicForm.lName}
              onChange={handleBasicInputChange("lName")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone number
            </label>
            <input
              type="tel"
              value={basicForm.phone}
              onChange={handleBasicInputChange("phone")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              placeholder="+123 456 789"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500"
            />
          </div>
        </div>

        {basicError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {basicError}
          </div>
        )}

        <div className="flex justify-end border-t border-gray-200 pt-4">
          <button
            type="submit"
            disabled={updateUserMutation.isPending || !hasBasicChanges}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateUserMutation.isPending ? "Saving..." : "Save Account Changes"}
          </button>
        </div>
      </form>

      <ConfidentialInfoForm
        initialData={confidentialInfo}
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        serverError={serverError}
      />
    </div>
  );
}