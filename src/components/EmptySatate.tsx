import React from "react";
import { FileX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ElementType | React.ReactNode;
  actionButton?: React.ReactNode;
  imageUrl?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data found",
  description = "There's nothing to display at the moment.",
  icon: Icon = FileX,
  actionButton = null,
  imageUrl = null,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-4 text-gray-400">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-24 h-24 object-contain"
          />
        ) : (
          <div className="flex items-center justify-center w-16 h-16">
            {typeof Icon === "function" ? (
              <Icon className="w-full h-full" />
            ) : (
              Icon
            )}
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-gray-500 max-w-sm mb-4">
        {description}
      </p>

      {actionButton && (
        <div className="mt-2">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default EmptyState;