export interface ConfidentialInfoPayload {
  isCompany: boolean;
  companyName?: string;
  dob?: string;
  nid?: string;
  passport?: string;
  driverLicense?: string;
  tin?: string;
  registrationCert?: File;
  addressCountry?: string;
  addressProvince?: string;
  addressDistrict?: string;
  addressSector?: string;
  addressCell?: string;
}

export interface PaymentChannelPayload {
  paymentMethod: string;
  paymentAccountNumber: string;
  isActive: boolean;
}

export interface PaymentChannel {
  id: number;
  userId: number;
  paymentMethod: string;
  paymentAccountNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConfidentialInfo {
  id: number;
  userId: number;
  isCompany: boolean;
  companyName: string | null;
  dob: string | null;
  nid: string | null;
  passport: string | null;
  driverLicense: string | null;
  tin: string | null;
  registrationCert: string | null;
  addressCountry: string | null;
  addressProvince: string | null;
  addressDistrict: string | null;
  addressSector: string | null;
  addressCell: string | null;
  phoneNumber: string | null;
  emergencyContact: string | null;
  socialMediaHandle: string | null;
  paymentMethod: string | null;
  paymentAccountNumber: string | null;
  registartionCertUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  uuid: string;
  fName: string;
  lName: string;
  phone: string | null;
  email: string;
  role: string;
  isActive: boolean;
  isTermsAccepted: boolean;
  lastLogin: string | null;
  picture: string | null;
  isVerified: boolean;
  is2fa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetailsResponse {
  user: UserProfile;
  confidentialInfo: ConfidentialInfo | null;
}

export interface UserDetailsPayload {
  fName?: string;
  lName?: string;
  phone?: string | null;
  picture?: string | null;
}

