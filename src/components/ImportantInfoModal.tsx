import React from "react";
import { X, User, Shield, Settings, Fuel, MapPin } from "lucide-react";

interface ImportantInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  carData?: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    securityDepositAmount?: number;
    securityDeposit?: string;
    damageExcess?: string;
    fuelPolicy?: string;
    currency?: string;
    requiredDocs?: string;
  };
}

export default function ImportantInfoModal({ 
  isOpen, 
  onClose, 
  carData 
}: ImportantInfoModalProps) {
  if (!isOpen) return null;

  // Function to strip HTML tags from text
  const stripHtmlTags = (html: string | undefined): string => {
    if (!html) return "";
    // Use regex to remove HTML tags
    return html.replace(/<[^>]*>/g, "").trim();
  };

  // Check if any important info is available
  const hasImportantInfo = 
    (carData?.requiredDocs && stripHtmlTags(carData.requiredDocs).length > 0) ||
    carData?.securityDepositAmount ||
    (carData?.securityDeposit && carData.securityDeposit.trim().length > 0) ||
    (carData?.damageExcess && carData.damageExcess.trim().length > 0) ||
    (carData?.fuelPolicy && carData.fuelPolicy.trim().length > 0) ||
    (carData?.mileage && typeof carData.mileage === "number" && carData.mileage > 0);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] min-h-[400px] border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Important info</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {!hasImportantInfo ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                No important info added
              </p>
              <p className="text-gray-600">
                The car owner has not provided important information for this vehicle.
              </p>
            </div>
          ) : (
            <>
              {/* Driver & License Requirements */}
              {(carData?.requiredDocs && stripHtmlTags(carData.requiredDocs).length > 0) && (
                <>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <User className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Driver & license requirements
                      </h3>
                      <p className="text-gray-600 mb-3">
                        When you pick the car up, you&apos;ll need:
                      </p>
                      <div className="text-gray-700 whitespace-pre-line">
                        {stripHtmlTags(carData.requiredDocs)}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 my-4"></div>
                </>
              )}

              {/* Security Deposit */}
              {(carData?.securityDepositAmount || carData?.securityDeposit) && (
                <>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Shield className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Security deposit
                      </h3>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        {carData?.securityDepositAmount
                          ? `${carData.securityDepositAmount.toLocaleString()} ${carData.currency || "RWF"}`
                          : carData?.securityDeposit || "250,000 RWF"}
                      </p>
                      <p className="text-gray-600">
                        At pick-up, the main driver will leave a refundable security deposit of{" "}
                        {carData?.securityDepositAmount
                          ? `${carData.securityDepositAmount.toLocaleString()} ${carData.currency || "RWF"}`
                          : carData?.securityDeposit || "250,000 RWF"}{" "}
                        on their credit or debit card or Cash.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 my-4"></div>
                </>
              )}

              {/* Damage Excess */}
              {carData?.damageExcess && (
                <>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Settings className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Damage Excess
                      </h3>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        {carData.damageExcess}
                      </p>
                      <p className="text-gray-600">
                        If the car&apos;s bodywork gets damaged, the most you&apos;ll pay towards repairs covered by the Collision Damage Waiver is the damage excess ({carData.damageExcess}). This cover is only valid if you stick to the terms of the rental agreement. It doesn&apos;t cover other parts of the car (e.g. windows, wheels, interior or undercarriage), or charges (e.g. for towing or off-road time), or anything in the car (e.g. child seats, GPS devices or personal belongings).
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 my-4"></div>
                </>
              )}

              {/* Fuel Policy */}
              {carData?.fuelPolicy && (
                <>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Fuel className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Fuel Policy
                      </h3>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        {carData.fuelPolicy}
                      </p>
                      <p className="text-gray-600">
                        When you pick your car up, the fuel tank will be full or partly full. You will leave a deposit to cover the cost of the fuel: the counter staff will block this money on your credit card. Just before you return your car, please replace the fuel you&apos;ve used.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 my-4"></div>
                </>
              )}

              {/* Mileage */}
              {carData?.mileage && (
                <>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <MapPin className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Mileage
                      </h3>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        {carData.mileage} kilometres per rental
                      </p>
                      <p className="text-gray-600">
                        If you drive more than {carData.mileage} kilometres during your rental, you&apos;ll pay 700 RWF for each additional kilometre when you drop your car off.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 my-4"></div>
                </>
              )}

              {/* Footer Disclaimer */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">
                  Please see the Service Provider&apos;s full terms and conditions below, which include the full name and company registered address of your Service Provider, information on and fees of extra products and services purchasable at the counter or based on your use of the rental, such as driving cross border and, if any, pick-up and drop-off grace periods.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

