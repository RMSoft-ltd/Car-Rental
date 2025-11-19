import { User } from "@/types/auth";

// Utility functions for user data
export const UserUtils = {
  /**
   * Get user's full name
   */
  getFullName: (user: User): string => {
    return `${user.fName} ${user.lName}`.trim();
  },

  /**
   * Check if user is admin
   */
  isAdmin: (user: User): boolean => {
    return user.role.toLowerCase() === 'admin';
  },

  /**
   * Check if user is active
   */
  isActive: (user: User): boolean => {
    return user.isActive && user.isVerified;
  },

  /**
   * Format user role for display
   */
  formatRole: (role: string): string => {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  },

  /**
   * Get user initials for avatar
   */
  getInitials: (user: User): string => {
    return `${user.fName.charAt(0)}${user.lName.charAt(0)}`.toUpperCase();
  },
};