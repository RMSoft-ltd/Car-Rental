"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User as UserIcon } from "lucide-react";
import { LuHouse } from "react-icons/lu";
import { ConfidentialInfo } from "@/types/user";


const profileSchema = z
  .object({
    isCompany: z.boolean(),
    companyName: z.string().optional(),
    dob: z.string().optional(),
    nid: z.string().optional(),
    passport: z.string().optional(),
    driverLicense: z.string().optional(),
    tin: z.string().optional(),
    addressCountry: z.string().optional(),
    addressProvince: z.string().optional(),
    addressDistrict: z.string().optional(),
    addressSector: z.string().optional(),
    addressCell: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isCompany && !data.companyName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Company name is required",
        path: ["companyName"],
      });
    }

    if (!data.isCompany) {
      if (!data.dob?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date of birth is required",
          path: ["dob"],
        });
      }

      if (
        !(
          data.nid?.trim() ||
          data.passport?.trim() ||
          data.driverLicense?.trim()
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Provide at least one identifier (NID, passport or driver license).",
          path: ["nid"],
        });
      }
    }
  });

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ConfidentialInfoFormProps {
  initialData?: ConfidentialInfo | null;
  onSubmit: (
    values: ProfileFormValues & { registrationCert?: File; recordId?: number }
  ) => void;
  isSubmitting: boolean;
  serverError?: string | null;
}

export function ConfidentialInfoForm({
  initialData,
  onSubmit,
  isSubmitting,
  serverError,
}: ConfidentialInfoFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [registrationCert, setRegistrationCert] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: getDefaultValues(initialData),
  });

  useEffect(() => {
    reset(getDefaultValues(initialData));
  }, [initialData, reset]);

  const isCompany = watch("isCompany");

  const handleFormSubmit = (values: ProfileFormValues) => {
    if (values.isCompany && !registrationCert && !initialData?.registartionCertUrl) {
      setFileError("Registration certificate is required for companies.");
      return;
    }
    setFileError(null);

    onSubmit({
      ...values,
      registrationCert: registrationCert ?? undefined,
      recordId: initialData?.id,
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setRegistrationCert(file ?? null);
    setFileError(null);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Account Type */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
          Account Type
        </h3>
        <Controller
          control={control}
          name="isCompany"
          render={({ field }) => (
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!field.value}
                  onChange={() => field.onChange(false)}
                  className="w-4 h-4 accent-black cursor-pointer focus:ring-black focus:ring-1"
                />
                <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                <span className="text-sm md:text-base text-gray-900">
                  Individual
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={field.value}
                  onChange={() => field.onChange(true)}
                  className="w-4 h-4 accent-black cursor-pointer focus:ring-black focus:ring-1"
                />
                <LuHouse className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                <span className="text-sm md:text-base text-gray-900">
                  Company
                </span>
              </label>
            </div>
          )}
        />
      </div>

      {/* Dynamic Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {isCompany ? (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                placeholder="Enter company name"
                {...register("companyName")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none"
              />
              {errors.companyName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Identification Number (TIN)
              </label>
              <input
                type="text"
                placeholder="Enter TIN"
                {...register("tin")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Certificate
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors cursor-pointer"
                >
                  Upload file
                </button>
                <span className="text-sm text-gray-600">
                  {registrationCert 
                    ? registrationCert.name 
                    : initialData?.registartionCertUrl 
                    ? "File already uploaded" 
                    : "No file selected"}
                </span>
              </div>
              {fileError && (
                <p className="text-sm text-red-600 mt-1">{fileError}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dob")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none cursor-pointer"
              />
              {errors.dob && (
                <p className="text-sm text-red-600 mt-1">{errors.dob.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                National ID
              </label>
              <input
                type="text"
                placeholder="Enter National ID"
                {...register("nid")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Number
              </label>
              <input
                type="text"
                placeholder="Enter passport number"
                {...register("passport")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver License Number
              </label>
              <input
                type="text"
                placeholder="Enter driver license"
                {...register("driverLicense")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none"
              />
            </div>
          </>
        )}
      </div>

      {/* Address Information */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Address Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              placeholder="Enter country"
              {...register("addressCountry")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Province
            </label>
            <input
              type="text"
              placeholder="Enter province"
              {...register("addressProvince")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <input
              type="text"
              placeholder="Enter district"
              {...register("addressDistrict")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector
            </label>
            <input
              type="text"
              placeholder="Enter sector"
              {...register("addressSector")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cell
            </label>
            <input
              type="text"
              placeholder="Enter cell"
              {...register("addressCell")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="flex items-center space-x-2 px-4 md:px-6 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="text-sm md:text-base">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </span>
        </button>
      </div>
    </form>
  );
}

function getDefaultValues(
  initialData?: ConfidentialInfo | null
): ProfileFormValues {
  return {
    isCompany: initialData?.isCompany ?? false,
    companyName: initialData?.companyName ?? "",
    dob: initialData?.dob ? initialData.dob.split("T")[0] : "",
    nid: initialData?.nid ?? "",
    passport: initialData?.passport ?? "",
    driverLicense: initialData?.driverLicense ?? "",
    tin: initialData?.tin ?? "",
    addressCountry: initialData?.addressCountry ?? "",
    addressProvince: initialData?.addressProvince ?? "",
    addressDistrict: initialData?.addressDistrict ?? "",
    addressSector: initialData?.addressSector ?? "",
    addressCell: initialData?.addressCell ?? "",
  };
}