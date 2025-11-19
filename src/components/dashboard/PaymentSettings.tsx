"use client";

import { useEffect, useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/shared/ToastProvider";
import {
  useAddPaymentChannelMutation,
  useUpdatePaymentChannelMutation,
  usePaymentChannelsQuery,
} from "@/hooks/use-user";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import { PaymentChannel } from "@/types/user";

interface PaymentMethod {
  id: string;
  backendId?: number;
  phoneNumber: string;
  displayName: string;
  isDefault: boolean;
  lastUsed?: string;
  verified: boolean;
}

const formatLastUsed = (iso?: string) => {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const mapChannelToPaymentMethod = (
  channel: PaymentChannel
): PaymentMethod => ({
  id: String(channel.id),
  backendId: channel.id,
  phoneNumber: channel.paymentAccountNumber,
  displayName: channel.paymentMethod || "Payment Channel",
  isDefault: channel.isActive,
  lastUsed: formatLastUsed(channel.createdAt),
  verified: channel.isActive,
});

export default function PaymentSettings() {
  const { user } = useAuth();
  const toast = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null);
  const {
    data: paymentChannels,
    isLoading: isChannelsLoading,
    refetch: refetchPaymentChannels,
  } = usePaymentChannelsQuery(user?.id, {
    onError: (message) => setFetchError(message),
  });

  useEffect(() => {
    if (paymentChannels) {
      setPaymentMethods(paymentChannels.map(mapChannelToPaymentMethod));
      setFetchError(null);
    }
  }, [paymentChannels]);
  
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
    setPaymentMethods((methods) =>
      methods.filter((method) => method.id !== id)
    );
  };

  const handleAddPaymentMethod = () => {
    if (!formData.phoneNumber || !formData.displayName) {
      setFormError("Please provide both the phone number and display name.");
      return;
    }

    addPaymentChannelMutation.mutate(
      {
        paymentMethod: "MTN Mobile Money",
        paymentAccountNumber: formData.phoneNumber,
        isActive: true,
      },
      {
        onSuccess: async () => {
          await refetchPaymentChannels();
          setShowAddForm(false);
          setFormData({ phoneNumber: "", displayName: "" });
          setFormError(null);
          toast.success(
            "Payment channel added",
            "You can now use this account for payouts."
          );
        },
      }
    );
  };

  const handleEditPaymentMethod = () => {
    if (!editingId) return;

    if (!formData.phoneNumber || !formData.displayName) {
      setEditError("Please provide both the phone number and display name.");
      return;
    }

    const target = paymentMethods.find((method) => method.id === editingId);
    if (!target) {
      setEditError("Unable to locate the selected payment method.");
      return;
    }

    if (!target.backendId) {
      // Fallback for local-only entries (should be rare)
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
      setEditError(null);
      return;
    }

    updatePaymentChannelMutation.mutate(
      {
        id: target.backendId,
        payload: {
          paymentMethod: formData.displayName,
          paymentAccountNumber: formData.phoneNumber,
          isActive: target.isDefault,
        },
      },
      {
        onSuccess: async () => {
          await refetchPaymentChannels();
          setEditingId(null);
          setFormData({ phoneNumber: "", displayName: "" });
          setEditError(null);
          toast.success("Payment method updated", "Your changes have been saved.");
        },
      }
    );
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
    setEditError(null);
  };

  const addPaymentChannelMutation = useAddPaymentChannelMutation(user?.id, {
    onError: (message) => setFormError(message),
  });
  const updatePaymentChannelMutation = useUpdatePaymentChannelMutation({
    onError: (message) => setEditError(message),
  });

  const handleDeleteRequest = (method: PaymentMethod) => {
    setDeleteTarget(method);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    removePaymentMethod(deleteTarget.id);
    toast.success("Payment method removed", "The account has been deleted.");
    setDeleteTarget(null);
  };

  const handleDeleteCancel = () => setDeleteTarget(null);

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
      {fetchError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {fetchError}
        </div>
      )}

      {/* Payment Methods List */}
      <div className="space-y-4">
        {isChannelsLoading ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-sm text-gray-500">
            Loading payment methods...
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-sm text-gray-500">
            You have no payment channels yet. Add one below to receive payouts.
          </div>
        ) : (
          paymentMethods.map((method) => (
            <div key={method.id}>
              {editingId === method.id ? (
                // Edit Form
                <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
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
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                {editError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {editError}
                  </div>
                )}

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
                    disabled={updatePaymentChannelMutation.isPending}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {updatePaymentChannelMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
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
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 font-medium">
                          MTN Mobile Money • {method.phoneNumber}
                        </p>
                        {method.lastUsed && (
                          <p className="text-xs text-gray-500 mt-1">
                            Added on {method.lastUsed}
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
                        onClick={() => handleDeleteRequest(method)}
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
          ))
        )}
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
                setFormError(null);
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
            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {formError}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setShowAddForm(false);
                setFormData({ phoneNumber: "", displayName: "" });
                setFormError(null);
              }}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPaymentMethod}
              disabled={addPaymentChannelMutation.isPending}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {addPaymentChannelMutation.isPending ? "Adding..." : "Add Account"}
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

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove payment method"
        description={`Are you sure you want to remove "${deleteTarget?.displayName ?? "this account"}"? This action cannot be undone.`}
        confirmLabel="Remove"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}