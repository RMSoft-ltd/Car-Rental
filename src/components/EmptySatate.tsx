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

export default EmptyState;
