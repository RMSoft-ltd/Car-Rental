import React from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ElementType | React.ReactNode;
  actionButton?: React.ReactNode;
  imageUrl?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No results found",
  description = "We couldn't find any cars matching your current filters. Try adjusting your selections or clearing the filters.",
  icon: Icon = SearchX,
  actionButton = null,
  imageUrl = null,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl shadow-md border border-gray-100 ${className}`}
    >
      <div className="mb-6">
        {imageUrl ? (
          // Render image if imageUrl is provided
          <img
            src={imageUrl}
            alt={title}
            className="w-28 h-28 object-contain"
          />
        ) : (
          // Render icon in a styled container for visual impact
          <div className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded-lg text-gray-500">
            {typeof Icon === "function" ? (
              // Lucide icon component logic
              <Icon className="w-12 h-12" />
            ) : (
              // Custom React Node icon logic
              Icon
            )}
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

      <p className="text-gray-600 max-w-md mb-6">{description}</p>

      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  );
};

export default React.memo(EmptyState);
EmptyState.displayName = "EmptyState";


// const EmptyState = React.memo(() => (
//   <div className="text-center py-16 px-4">
//     <div className="max-w-md mx-auto">
//       <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//         <svg 
//           className="w-12 h-12 text-gray-400" 
//           fill="none" 
//           stroke="currentColor" 
//           viewBox="0 0 24 24"
//         >
//           <path 
//             strokeLinecap="round" 
//             strokeLinejoin="round" 
//             strokeWidth={1.5} 
//             d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
//           />
//         </svg>
//       </div>
//       <h3 className="text-xl font-semibold text-gray-900 mb-2">
//         No cars available
//       </h3>
//       <p className="text-gray-600 mb-6">
//         We couldn't find any cars matching your current filters. Try adjusting your search criteria or clearing some filters to see more options.
//       </p>
//       <div className="space-y-3">
//         <p className="text-sm text-gray-500">
//           You can try:
//         </p>
//         <ul className="text-sm text-gray-600 space-y-1">
//           <li>• Clearing some filters</li>
//           <li>• Expanding your price range</li>
//           <li>• Trying different car types</li>
//           <li>• Checking other transmission options</li>
//         </ul>
//       </div>
//     </div>
//   </div>
// ));
// EmptyState.displayName = "EmptyState";
