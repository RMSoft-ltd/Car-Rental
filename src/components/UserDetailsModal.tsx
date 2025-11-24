"use client";

import { useState } from "react";
import { 
  X, 
  Edit, 
  Save,  
  Mail, 
  Phone, 
  Shield, 
  Calendar,
  MapPin,
  Building,
  IdCard,
  CreditCard,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/Avator";
import { formatDate } from "@/utils/formatter";
import { ConfidentialInfo, UpdateUserPayload } from "@/types/user";
import { User } from "@/types/auth";
import { useUser } from "@/hooks/use-user-managments";

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (userId: number, payload: UpdateUserPayload) => Promise<void>;
}

export function UserDetailsModal({ user, isOpen, onClose, onUpdateUser }: UserDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UpdateUserPayload>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch detailed user data with confidential info
  const { data: userDetails, isLoading: isLoadingDetails } = useUser(user?.id || 0, {
    enabled: isOpen && !!user,
  });

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    if (!user?.id) return;

     const payload = {
      fName: editedUser.fName !== undefined ? editedUser.fName : user.fName,
      lName: editedUser.lName !== undefined ? editedUser.lName : user.lName,
    };
    
    try {
      setIsUpdating(true);
      await onUpdateUser(user.id, payload);
      setIsEditing(false);
      setEditedUser({});
      onClose();
    } catch (error) {
    console.error("Error updating user:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({});
  };

  const confidentialInfo = userDetails?.confidentialInfo;

  const getAddressString = (confInfo: ConfidentialInfo) => {
    const addressParts = [
      confInfo.addressCell,
      confInfo.addressSector,
      confInfo.addressDistrict,
      confInfo.addressProvince,
      confInfo.addressCountry
    ].filter(Boolean);
    
    return addressParts.join(', ') || 'Not provided';
  };

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size="large" />
            <div>
              <h2 className="text-xl font-semibold">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      value={editedUser.fName || user.fName}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, fName: e.target.value }))}
                      placeholder="First name"
                      className="w-32"
                    />
                    <Input
                      value={editedUser.lName || user.lName}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, lName: e.target.value }))}
                      placeholder="Last name"
                      className="w-32"
                    />
                  </div>
                ) : (
                  `${user.fName} ${user.lName}`
                )}
              </h2>
              {
                confidentialInfo?.nid && (
                    <p className="text-gray-500 text-sm">NID: {confidentialInfo.nid}</p>    
                )
              }
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Name
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isUpdating ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
            <Button variant="ghost" onClick={onClose} size="sm">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">2FA Status</p>
                <Badge variant={user.is2fa ? "default" : "outline"}>
                  {user.is2fa ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Confidential Information */}
        {confidentialInfo && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Confidential Information</h3>
            
            {isLoadingDetails ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-500">Loading confidential information...</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <IdCard className="w-4 h-4" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Date of Birth</p>
                      <p className="font-medium">
                        {confidentialInfo.dob ? formatDate(confidentialInfo.dob) : 'Not provided'}
                      </p>
                    </div>
                    
                    {confidentialInfo.isCompany && (
                      <div>
                        <p className="text-gray-500 mb-1">Company Name</p>
                        <p className="font-medium">{confidentialInfo.companyName}</p>
                      </div>
                    )}
                    
                    {confidentialInfo.nid && (
                      <div>
                        <p className="text-gray-500 mb-1">National ID</p>
                        <p className="font-medium">{confidentialInfo.nid}</p>
                      </div>
                    )}
                    
                    {confidentialInfo.passport && (
                      <div>
                        <p className="text-gray-500 mb-1">Passport</p>
                        <p className="font-medium">{confidentialInfo.passport}</p>
                      </div>
                    )}
                    
                    {confidentialInfo.driverLicense && (
                      <div>
                        <p className="text-gray-500 mb-1">Driver License</p>
                        <p className="font-medium">{confidentialInfo.driverLicense}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address Information
                  </h4>
                  <div className="text-sm">
                    <p className="text-gray-500 mb-1">Full Address</p>
                    <p className="font-medium">{getAddressString(confidentialInfo)}</p>
                  </div>
                </div>

                {/* Contact & Payment Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Contact Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      {confidentialInfo.phoneNumber && (
                        <div>
                          <p className="text-gray-500 mb-1">Phone Number</p>
                          <p className="font-medium">{confidentialInfo.phoneNumber}</p>
                        </div>
                      )}
                      
                      {confidentialInfo.emergencyContact && (
                        <div>
                          <p className="text-gray-500 mb-1">Emergency Contact</p>
                          <p className="font-medium">{confidentialInfo.emergencyContact}</p>
                        </div>
                      )}
                      
                      {confidentialInfo.socialMediaHandle && (
                        <div>
                          <p className="text-gray-500 mb-1">Social Media</p>
                          <p className="font-medium">{confidentialInfo.socialMediaHandle}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      {confidentialInfo.paymentMethod && (
                        <div>
                          <p className="text-gray-500 mb-1">Payment Method</p>
                          <p className="font-medium">{confidentialInfo.paymentMethod}</p>
                        </div>
                      )}
                      
                      {confidentialInfo.paymentAccountNumber && (
                        <div>
                          <p className="text-gray-500 mb-1">Account Number</p>
                          <p className="font-medium">{confidentialInfo.paymentAccountNumber}</p>
                        </div>
                      )}
                      
                      {confidentialInfo.tin && (
                        <div>
                          <p className="text-gray-500 mb-1">TIN Number</p>
                          <p className="font-medium">{confidentialInfo.tin}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Registration Certificate */}
                {confidentialInfo.registartionCertUrl && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Registration Certificate
                    </h4>
                    <div className="text-sm">
                      <p className="text-gray-500 mb-1">Certificate URL</p>
                      <a 
                        href={confidentialInfo.registartionCertUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 break-all"
                      >
                        {confidentialInfo.registartionCertUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}