"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Settings,
  CreditCard,
  Receipt,
} from "lucide-react";
import SecuritySettings from "./SecuritySettings";
import ProfileSettings from "./ProfileSettings";
import PaymentSettings from "./PaymentSettings";
import BillingSettings from "./BillingSettings";

// Main Settings Component
export default function SettingsContent() {
  const [activeSection, setActiveSection] = useState("profile");

  const settingsSections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "payment", label: "Payment Config", icon: CreditCard },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Billing", icon: Receipt },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings />;
      case "security":
        return <SecuritySettings />;
      case "payment":
        return <PaymentSettings />;
      case "billing":
        return <BillingSettings />;;
      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Coming Soon
              </h3>
              <p className="text-gray-500">
                {settingsSections.find((s) => s.id === activeSection)?.label}{" "}
                settings are under development.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-8 h-full overflow-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
          Settings
        </h2>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Horizontal Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4 md:space-x-8 min-w-max px-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 py-3 md:py-4 px-1 border-b-2 text-sm md:text-base whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeSection === section.id
                      ? "border-gray-900 text-gray-900 font-bold"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium"
                  }`}
                >
                  <section.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="hidden sm:inline">{section.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        {renderContent()}
      </div>
    </div>
  );
}
