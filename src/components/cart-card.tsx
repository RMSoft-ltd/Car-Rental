"use client";

import { Users, Briefcase, Clock, Settings, Trash2, Pencil } from "lucide-react";
import { baseUrl } from "@/lib/api";
import Image from "next/image";
import { CartItem } from "@/types/cart";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { calculatePreviewPrice } from "@/hooks/use-cart-items";

interface CartCardProps {
  item: CartItem;
  onUpdateDates: (cartItemId: number, pickUpDate: string, dropOffDate: string) => void;
  onDeleteItem: (cartItemId: number) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export default function CartCard({
  item,
  onUpdateDates,
  onDeleteItem,
  isUpdating = false,
  isDeleting = false,
}: CartCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [pickUpDate, setPickUpDate] = useState(item.pickUpDate);
  const [dropOffDate, setDropOffDate] = useState(item.dropOffDate);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  
  // Preview calculation for editing mode
  const [previewDays, setPreviewDays] = useState(item.totalDays);
  const [previewPrice, setPreviewPrice] = useState(item.totalAmount);

  // Update preview when dates change in edit mode
  useEffect(() => {
    if (isEditing) {
      const { days, total } = calculatePreviewPrice(
        item.car.pricePerDay,
        pickUpDate,
        dropOffDate
      );
      setPreviewDays(days);
      setPreviewPrice(total);
    }
  }, [pickUpDate, dropOffDate, isEditing, item.car.pricePerDay]);

  // Use backend-calculated values when not editing
  const displayPrice = isEditing ? previewPrice : item.totalAmount;

  const handleSaveDates = () => {
    // Validate dates
    if (new Date(pickUpDate) >= new Date(dropOffDate)) {
      alert("Drop-off date must be after pick-up date");
      return;
    }
    setShowUpdateDialog(true);
  };

  const confirmUpdate = () => {
    onUpdateDates(item.id, pickUpDate, dropOffDate);
    setIsEditing(false);
    setShowUpdateDialog(false);
  };

  const handleCancelEdit = () => {
    // Reset to original backend values
    setPickUpDate(item.pickUpDate);
    setDropOffDate(item.dropOffDate);
    setPreviewDays(item.totalDays);
    setPreviewPrice(item.totalAmount);
    setIsEditing(false);
  };

  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDeleteItem(item.id);
    setShowDeleteDialog(false);
  };

  // Get best available image
  const carImageUrl = item.car?.carImages?.length > 0 
    ? `${baseUrl}${item.car.carImages[0]}`
    : '/placeholder-car.jpg';

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="flex flex-col md:flex-row">
          {/* Car Image */}
          <div className="w-full md:w-64 h-56 flex-shrink-0 relative">
            <Image
              src={carImageUrl}
              fill
              className="object-contain p-4"
              alt={`${item.car.make} ${item.car.model}`}
              onError={(e) => {
                e.currentTarget.src = '/placeholder-car.jpg';
              }}
              sizes="(max-width: 768px) 100vw, 256px"
            />
          </div>

          {/* Car Details */}
          <div className="flex-1 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {item.car.make} {item.car.model} {item.car.year}
            </h3>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex items-center text-sm text-gray-700">
                <Users className="w-4 h-4 mr-2" />
                <span>{item.car.seats || 4} Seats</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>{item.car.body}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Clock className="w-4 h-4 mr-2" />
                <span>{item.car.mileage?.toLocaleString()} km</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                <span>{item.car.transition}</span>
              </div>
            </div>
          </div>

          {/* Price and Dates Section */}
          <div className="border-t md:border-t-0 md:border-l border-gray-200 p-6 md:w-80 flex flex-col justify-between">
            <div className="text-right mb-4">
              <p className="text-2xl font-bold text-gray-900">
                {displayPrice.toLocaleString()} RWF
              </p>
              <p className="text-sm text-gray-500">
                {item.totalDays} day{item.totalDays !== 1 ? 's' : ''} • {item.car.pricePerDay.toLocaleString()} RWF/day
              </p>
              {isEditing && displayPrice !== item.totalAmount && (
                <p className="text-xs text-orange-600 mt-1">
                  Preview price (will update on save)
                </p>
              )}
            </div>

            <div className="border border-gray-900 rounded-lg p-4">
              {isEditing ? (
                // Edit Mode
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-900 mb-1 block">
                        PICK-UP DATE
                      </label>
                      <input
                        type="date"
                        value={pickUpDate}
                        onChange={(e) => setPickUpDate(e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-900 mb-1 block">
                        DROP-OFF DATE
                      </label>
                      <input
                        type="date"
                        value={dropOffDate}
                        onChange={(e) => setDropOffDate(e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        min={pickUpDate}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveDates}
                      disabled={isUpdating}
                      className={`flex-1 py-1 text-sm rounded ${
                        isUpdating
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="flex-1 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode - Display backend data
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-1">PICK-UP DATE</p>
                    <p className="text-sm text-gray-700">{formatDisplayDate(item.pickUpDate)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-900 mb-1">DROP-OFF DATE</p>
                    <p className="text-sm text-gray-700">{formatDisplayDate(item.dropOffDate)}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => setIsEditing(true)}
                      disabled={isUpdating || isDeleting}
                      className="p-1 hover:bg-gray-100 cursor-pointer rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit dates"
                    >
                      <Pencil className="w-4 h-4"/>
                    </button>
                    <button 
                      onClick={handleDeleteClick}
                      disabled={isDeleting || isUpdating}
                      className="p-1 hover:bg-red-50 cursor-pointer rounded transition-colors text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Loading Overlay */}
        {(isUpdating || isDeleting) && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the {item.car.make} {item.car.model} from your cart?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Removing..." : "Remove Item"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Confirmation Dialog */}
      <AlertDialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update rental dates?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the rental dates for your {item.car.make} {item.car.model}?
              <br />
              <span className="font-semibold mt-2 block">
                New total: {previewPrice.toLocaleString()} RWF for {previewDays} day{previewDays !== 1 ? 's' : ''}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Dates"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}