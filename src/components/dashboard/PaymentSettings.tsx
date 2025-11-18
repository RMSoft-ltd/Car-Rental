"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  Shield,
  Phone,
  X,
  Smartphone,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  phoneNumber: string;
  displayName: string;
  isDefault: boolean;
  lastUsed?: string;
  verified: boolean;
}

export default function PaymentSettings() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      phoneNumber: "+250 788 123 456",
      displayName: "My Primary MTN Account",
      isDefault: true,
      lastUsed: "2 days ago",
      verified: true,
    },
    {
      id: "2",
      phoneNumber: "+250 788 789 012",
      displayName: "Business MTN Account",
      isDefault: false,
      lastUsed: "1 week ago",
      verified: true,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    phoneNumber: "",
    displayName: "",
  });

  const setDefaultPayment = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const removePaymentMethod = (id: string) => {
    if (window.confirm("Are you sure you want to remove this payment method?")) {
      setPaymentMethods((methods) =>
        methods.filter((method) => method.id !== id)
      );
    }
  };

  const handleAddPaymentMethod = () => {
    if (!formData.phoneNumber || !formData.displayName) {
      alert("Please fill in all fields");
      return;
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      phoneNumber: formData.phoneNumber,
      displayName: formData.displayName,
      isDefault: paymentMethods.length === 0,
      verified: false,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddForm(false);
    setFormData({ phoneNumber: "", displayName: "" });
  };

  const handleEditPaymentMethod = () => {
    if (!editingId) return;

    setPaymentMethods((methods) =>
      methods.map((method) =>
        method.id === editingId
          ? {
              ...method,
              phoneNumber: formData.phoneNumber,
              displayName: formData.displayName,
            }
          : method
      )
    );

    setEditingId(null);
    setFormData({ phoneNumber: "", displayName: "" });
  };

  const startEdit = (method: PaymentMethod) => {
    setEditingId(method.id);
    setFormData({
      phoneNumber: method.phoneNumber,
      displayName: method.displayName,
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ phoneNumber: "", displayName: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          MTN Mobile Money Accounts
        </h3>
        <p className="text-sm text-gray-600">
          Manage your MTN Mobile Money accounts for car rental payments
        </p>
      </div>

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id}>
            {editingId === method.id ? (
              // Edit Form
              <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Edit Payment Method</h4>
                  <button
                    onClick={cancelEdit}
                    className="p-1 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      MTN Mobile Money Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        placeholder="+250 788 XXX XXX"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) =>
                        setFormData({ ...formData, displayName: e.target.value })
                      }
                      placeholder="e.g., My Primary MTN Account"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={cancelEdit}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditPaymentMethod}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              // Display Mode
              <div
                className={`border-2 rounded-xl p-5 transition-all ${
                  method.isDefault
                    ? "border-gray-900 bg-gray-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* MTN Icon */}
                    <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center shadow-md">
                      <Smartphone className="w-7 h-7 text-white" />
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {method.displayName}
                        </h4>
                        {method.isDefault && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-900 text-white">
                            <Check className="w-3 h-3 mr-1" />
                            Default
                          </span>
                        )}
                        {method.verified && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        MTN Mobile Money • {method.phoneNumber}
                      </p>
                      {method.lastUsed && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last used {method.lastUsed}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => setDefaultPayment(method.id)}
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(method)}
                      className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removePaymentMethod(method.id)}
                      className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Payment Method */}
      {!showAddForm && !editingId ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 hover:bg-gray-50 transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 transition-colors">
            <Plus className="w-6 h-6 text-gray-600" />
          </div>
          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
            Add New MTN Mobile Money Account
          </span>
          <p className="text-xs text-gray-500 mt-1">Securely add another payment method</p>
        </button>
      ) : showAddForm ? (
        <div className="border-2 border-gray-300 rounded-xl p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold text-gray-900 text-lg">Add MTN Mobile Money Account</h4>
            <button
              onClick={() => {
                setShowAddForm(false);
                setFormData({ phoneNumber: "", displayName: "" });
              }}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-5">
            {/* MTN Info Banner */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">MTN Mobile Money</p>
                  <p className="text-xs text-gray-600">Rwanda&apos;s leading mobile payment service</p>
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                MTN Mobile Money Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="+250 788 XXX XXX"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Enter your MTN Mobile Money registered phone number
              </p>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="e.g., My Primary MTN Account"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Give this account a memorable name
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setShowAddForm(false);
                setFormData({ phoneNumber: "", displayName: "" });
              }}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPaymentMethod}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm cursor-pointer"
            >
              Add Account
            </button>
          </div>
        </div>
      ) : null}

      {/* Security Notice */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Secure & Safe Payments
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your MTN Mobile Money information is encrypted and securely stored. 
              All transactions are processed through the official MTN payment gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}