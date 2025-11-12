"use client";

import { useState } from "react";
import { Search, MoreVertical } from "lucide-react";

// Mock rental history data
const mockRentalHistory = [
  {
    id: 1,
    car: {
      make: "Range Rover",
      model: "Evoque",
      type: "SUV",
      image: "/images/abstract-user-flat-4.png"
    },
    pickedDate: "12 Apr, 2024",
    returnedDate: "16 Apr, 2024",
    price: "40,000 RWF",
    totalAmount: "160,000 RWF"
  },
  {
    id: 2,
    car: {
      make: "Range Rover",
      model: "Evoque",
      type: "SUV",
      image: "/images/abstract-user-flat-4.png"
    },
    pickedDate: "12 Apr, 2024",
    returnedDate: "16 Apr, 2024",
    price: "40,000 RWF",
    totalAmount: "160,000 RWF"
  },
  {
    id: 3,
    car: {
      make: "Range Rover",
      model: "Evoque",
      type: "SUV",
      image: "/images/abstract-user-flat-4.png"
    },
    pickedDate: "12 Apr, 2024",
    returnedDate: "16 Apr, 2024",
    price: "40,000 RWF",
    totalAmount: "160,000 RWF"
  },
  {
    id: 4,
    car: {
      make: "Range Rover",
      model: "Evoque",
      type: "SUV",
      image: "/images/abstract-user-flat-4.png"
    },
    pickedDate: "12 Apr, 2024",
    returnedDate: "16 Apr, 2024",
    price: "40,000 RWF",
    totalAmount: "160,000 RWF"
  },
  {
    id: 5,
    car: {
      make: "Range Rover",
      model: "Evoque",
      type: "SUV",
      image: "/images/abstract-user-flat-4.png"
    },
    pickedDate: "12 Apr, 2024",
    returnedDate: "16 Apr, 2024",
    price: "40,000 RWF",
    totalAmount: "160,000 RWF"
  },
  {
    id: 6,
    car: {
      make: "Toyota",
      model: "Camry",
      type: "Sedan",
      image: "/images/abstract-user-flat-4.png"
    },
    pickedDate: "20 Apr, 2024",
    returnedDate: "25 Apr, 2024",
    price: "35,000 RWF",
    totalAmount: "175,000 RWF"
  },
  {
    id: 7,
    car: {
      make: "Honda",
      model: "Civic",
      type: "Sedan",
      image: "/images/abstract-user-flat-4.png"
    },
    pickedDate: "28 Apr, 2024",
    returnedDate: "02 May, 2024",
    price: "30,000 RWF",
    totalAmount: "150,000 RWF"
  },
  {
    id: 8,
    car: {
      make: "BMW",
      model: "X5",
      type: "SUV",
      image: "/images/abstract-user-flat-4.png"
    },
    pickedDate: "05 May, 2024",
    returnedDate: "10 May, 2024",
    price: "50,000 RWF",
    totalAmount: "250,000 RWF"
  },
  {
    id: 9,
    car: {
      make: "Mercedes",
      model: "C-Class",
      type: "Sedan",
      image: "/images/abstract-user-flat-4.png"
    },
    pickedDate: "15 May, 2024",
    returnedDate: "20 May, 2024",
    price: "45,000 RWF",
    totalAmount: "225,000 RWF"
  },
  {
    id: 10,
    car: {
      make: "Audi",
      model: "A4",
      type: "Sedan",
      image: "/images/abstract-user-flat-4.png"
    },
    pickedDate: "25 May, 2024",
    returnedDate: "30 May, 2024",
    price: "42,000 RWF",
    totalAmount: "210,000 RWF"
  },
  {
    id: 11,
    car: {
      make: "Nissan",
      model: "Altima",
      type: "Sedan",
      image: "/images/abstract-user-flat-4.png"
    },
    pickedDate: "02 Jun, 2024",
    returnedDate: "07 Jun, 2024",
    price: "32,000 RWF",
    totalAmount: "160,000 RWF"
  },
  {
    id: 12,
    car: {
      make: "Hyundai",
      model: "Elantra",
      type: "Sedan",
      image: "/images/abstract-user-flat-4.png"
    },
    pickedDate: "10 Jun, 2024",
    returnedDate: "15 Jun, 2024",
    price: "28,000 RWF",
    totalAmount: "140,000 RWF"
  }
];

export default function RentalHistoryContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter rentals based on search query
  const filteredRentals = mockRentalHistory.filter(rental =>
    rental.car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rental.car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRentals = filteredRentals.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAction = (rentalId: number, action: string) => {
    console.log(`Action: ${action} for rental ID: ${rentalId}`);
    // Implement action logic here
  };

  return (
    <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
      <div className="container mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Type make or model to search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </form>

        {/* Rental History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Car Details
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Picked Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Returned Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gray-50">
                    {/* Car Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={rental.car.image}
                          alt={`${rental.car.make} ${rental.car.model}`}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {rental.car.make}, {rental.car.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {rental.car.type}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Picked Date */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {rental.pickedDate}
                    </td>

                    {/* Returned Date */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {rental.returnedDate}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {rental.price}
                    </td>

                    {/* Total Amount */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {rental.totalAmount}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleAction(rental.id, "menu")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="More actions"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              title="Previous Page"
              className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full font-medium transition-colors ${currentPage === page
                  ? "bg-black text-white"
                  : "border border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              title="Next Page"
              className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredRentals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No rental history found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
