import { User } from "./auth";
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

export interface SingleUserResponse {
  user: User;
  confidentialInfo: ConfidentialInfo;
}




export interface PaymentChannel {
  paymentMethod: string;
  paymentAccountNumber: string;
  isActive: boolean;
}


export interface VerifyEmailPayload {
  token: string;
}

export interface Enable2FAPayload {
  is2fa: boolean;
}

export interface UpdateUserPayload {
  fName?: string;
  lName?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface PaymentChannelPayload {
  paymentMethod: string;
  paymentAccountNumber: string;
  isActive: boolean;
}

export interface UpdatePaymentChannelPayload {
  paymentMethod: string;
  paymentAccountNumber: number;
  isActive: boolean;
}

export interface UsersFilterParams {
  limit?: number;
  skip?: number;
  search?: string;
  isVerified?: boolean;
  isGoogleAuth?: boolean;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export interface UsersResponse {
  limit: number;
  skip: number;
  count: number;
  rows: User[];
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface SignupResponse {
  message: string;
  user?: User;
  verifyToken?: string;
}

export interface VerifyEmailResponse {
  message: string;
  user?: User;
}

export interface ToggleStatusResponse {
  message: string;
  user: User;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface Enable2FAResponse {
  message: string;
  is2fa: boolean;
}
