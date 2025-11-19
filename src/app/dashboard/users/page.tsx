"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  User,
  Filter,
  Mail,
  Phone,
  Calendar,
  Shield,
  Eye,
  Ban,
  CheckCircle,
} from "lucide-react";
import {
  usePaginatedUsers,
  useToggleUserStatus,
  useUpdateUser,
} from "@/hooks/use-user-managments";
import { formatDate } from "@/utils/formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserAvatar } from "@/components/Avator";
import { UsersFilterParams, UpdateUserPayload } from "@/types/user";
import { useToast } from "@/app/shared/ToastProvider";
import { UserDetailsModal } from "@/components/UserDetailsModal";
import { User as UserType } from "@/types/auth";

export default function UserManagement() {
  const [filters, setFilters] = useState<UsersFilterParams>({
    skip: 0,
    limit: 25,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const isPaginationChange = useRef(false);

  const toast = useToast();

  // User data with filters
  const {
    data: usersData,
    isLoading,
    refetch,
    error,
  } = usePaginatedUsers(currentPage, filters.limit || 25, filters);

  const toggleStatusMutation = useToggleUserStatus();
  const updateUserMutation = useUpdateUser();

  // Debounce only for search/filter changes, not pagination
  useEffect(() => {
    if (isPaginationChange.current) {
      isPaginationChange.current = false;
      refetch();
      return;
    }

    const timeoutId = setTimeout(() => {
      refetch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, refetch]);

  // Handle user details view
  const handleViewDetails = useCallback((user: UserType) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  }, []);

  // Handle user update from modal - only fName and lName
  const handleUpdateUser = useCallback(
    async (userId: number, payload: UpdateUserPayload) => {
      try {
        await updateUserMutation.mutateAsync({
          id: userId,
          payload,
        });
        toast.success(
          "User updated",
          "User name has been updated successfully."
        );
        refetch(); // Refresh the user list
      } catch (error) {
        toast.error(
          "Update failed",
          "Failed to update user name. Please try again."
        );
        throw error; // Re-throw to handle in modal
      }
    },
    [updateUserMutation, toast, refetch]
  );

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchQuery || undefined,
      skip: 0,
    }));
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof UsersFilterParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      skip: 0,
    }));
    setCurrentPage(1);
  };

  // Handle pagination - no debounce, immediate response
  const handlePageChange = (page: number) => {
    isPaginationChange.current = true;
    const newSkip = (page - 1) * (filters.limit || 25);
    setCurrentPage(page);
    setFilters((prev) => ({
      ...prev,
      skip: newSkip,
    }));
  };

  // Handle user status toggle with toast
  const handleToggleStatus = useCallback(
    async (userId: number, currentStatus: boolean) => {
      try {
        await toggleStatusMutation.mutateAsync(userId);
        toast.success(
          "User status updated",
          `User has been ${
            currentStatus ? "deactivated" : "activated"
          } successfully.`
        );
        refetch(); // Refresh the list
      } catch (error) {
        toast.error(
          "Update failed",
          "Failed to update user status. Please try again."
        );
      }
    },
    [toggleStatusMutation, toast, refetch]
  );

  // Get current users
  const currentUsers = usersData?.rows || [];
  const totalCount = usersData?.count || 0;
  const itemsPerPage = filters.limit || 25;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Get status variant for badges
  const getStatusVariant = (isActive: boolean) => {
    return isActive ? "default" : "secondary";
  };

  // Get verification badge
  const getVerificationBadge = (isVerified: boolean) => {
    return isVerified ? "default" : "outline";
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({ skip: 0, limit: 25 });
    setSearchQuery("");
    setCurrentPage(1);
    toast.info("Filters cleared", "All filters have been reset.");
  };

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast.error("Loading failed", "Failed to load users. Please try again.");
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
      <div className="container mx-auto">
        {/* Search and Filters Section */}
        <div className="space-y-6 mb-8">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 ">
                <Filter className="w-5 h-5" />
                <span className="font-semibold text-lg">Filters</span>
              </div>

              <p className="text-gray-600 mt-2">
                Manage and monitor all system users
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by name, email, or user ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-6 text-base"
                />
              </div>
              <Button
                type="submit"
                className="bg-black text-white px-8 py-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 min-w-32"
              >
                <Search className="w-5 h-5" />
                Search
              </Button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
              {/* Role Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <Select
                  value={filters.role || ""}
                  onValueChange={(value) => handleFilterChange("role", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  value={filters.isActive?.toString() || ""}
                  onValueChange={(value) =>
                    handleFilterChange("isActive", value === "true")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Verification Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Verification
                </label>
                <Select
                  value={filters.isVerified?.toString() || ""}
                  onValueChange={(value) =>
                    handleFilterChange("isVerified", value === "true")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Verified</SelectItem>
                    <SelectItem value="false">Not Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Google Auth Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Google Auth
                </label>
                <Select
                  value={filters.isGoogleAuth?.toString() || ""}
                  onValueChange={(value) =>
                    handleFilterChange("isGoogleAuth", value === "true")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All auth types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Google Auth</SelectItem>
                    <SelectItem value="false">Email/Password</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="space-y-2 flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Clear All Filters
                </label>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {totalCount > 0 && (
            <div className="mb-4 text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(currentPage * itemsPerPage, totalCount)}
              </span>{" "}
              of <span className="font-semibold">{totalCount}</span> users
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Verification
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      2FA
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Joined Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} />
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 truncate">
                              {user.fName} {user.lName}
                            </div>
                            {/* <div className="text-sm text-gray-500 truncate">
                              ID: {user.uuid}
                            </div> */}
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge variant={getStatusVariant(user.isActive)}>
                          {user.isActive ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Ban className="w-3 h-3" />
                              Inactive
                            </div>
                          )}
                        </Badge>
                      </td>

                      {/* Verification */}
                      <td className="px-6 py-4">
                        <Badge variant={getVerificationBadge(user.isVerified)}>
                          {user.isVerified ? "Verified" : "Pending"}
                        </Badge>
                      </td>

                      {/* 2FA */}
                      <td className="px-6 py-4">
                        <Badge variant={user.is2fa ? "default" : "outline"}>
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {user.is2fa ? "Enabled" : "Disabled"}
                          </div>
                        </Badge>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleToggleStatus(user.id, user.isActive)
                            }
                            disabled={toggleStatusMutation.isPending}
                            className="min-w-24"
                          >
                            {toggleStatusMutation.isPending ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            ) : user.isActive ? (
                              "Deactivate"
                            ) : (
                              "Activate"
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="View Details"
                            onClick={() => handleViewDetails(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  title="Previous Page"
                  className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-full font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-black text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  title="Next Page"
                  className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* No Results */}
          {currentUsers.length === 0 && !isLoading && (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                No users found matching your criteria.
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Try adjusting your search terms or filters.
              </p>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="mt-2"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
}