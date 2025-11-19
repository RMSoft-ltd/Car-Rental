export interface User {
  id: number;
  uuid: string;
  fName: string;
  lName: string;
  phone: string | null;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  isTermsAccepted: boolean;
  lastLogin: string | null;
  resetToken: string | null;
  refreshToken: string | null;
  verifyToken: string | null;
  is2fa: boolean | null;
  googleId: string | null;
  picture: string;
  isGoogleAuth: boolean | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface TwoFactorChallenge {
  requiresTwoFactor: true;
  twoFactorToken?: string;
  message?: string;
}

export type LoginResult = AuthResponse | TwoFactorChallenge;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fName: string;
  lName: string;
  email: string;
  password: string;
  isTermsAccepted: boolean;
}
