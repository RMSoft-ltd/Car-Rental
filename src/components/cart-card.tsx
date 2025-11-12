"use client";

import { Users, Briefcase, Clock, Settings, Trash2, Pencil } from "lucide-react";
import { baseUrl } from "@/lib/api";
import Image from "next/image";
import { CartItem } from "@/types/cart";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";

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

  // Calculate number of days between dates
  const calculateDays = () => {
    const pickUp = new Date(pickUpDate);
    const dropOff = new Date(dropOffDate);
    const timeDiff = dropOff.getTime() - pickUp.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Math.max(days, 1);
  };

  const days = calculateDays();
  const totalPrice = item.car.pricePerDay * days;

  const handleSaveDates = () => {
    setShowUpdateDialog(true);
  };

  const confirmUpdate = () => {
    onUpdateDates(item.id, pickUpDate, dropOffDate);
    setIsEditing(false);
    setShowUpdateDialog(false);
  };

  const handleCancelEdit = () => {
    setPickUpDate(item.pickUpDate);
    setDropOffDate(item.dropOffDate);
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

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="flex flex-col md:flex-row">
          {/* Car Image */}
          <div className="w-full md:w-64 h-56 flex-shrink-0 relative">
            <Image
              src={
                item.car && item.car.carImages.length > 0
                  ? `${baseUrl}${item.car.carImages[0]}`
                  : `/placeholder-car.jpg`
              }
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
                <span>{item.car?.engineSize || item.car.doors} Seats</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>{item.car.body} Luggage</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Clock className="w-4 h-4 mr-2" />
                <span>{item.car.mileage} per rental</span>
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
                {totalPrice.toLocaleString()} Rfw
              </p>
              <p className="text-sm text-gray-500">
                {days} day{days !== 1 ? 's' : ''} • {item.car.pricePerDay.toLocaleString()} Rfw/day
              </p>
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
                // View Mode
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
                      disabled={isUpdating}
                      className="p-1 hover:bg-gray-100 cursor-pointer rounded transition-colors"
                      title="Edit dates"
                    >
                      <Pencil className="w-4 h-4"/>
                    </button>
                    <button 
                      onClick={handleDeleteClick}
                      disabled={isDeleting}
                      className="p-1 hover:bg-red-50 cursor-pointer rounded transition-colors text-red-600"
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
              This will recalculate the total price based on the new dates.
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