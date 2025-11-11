import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { baseUrl } from "@/lib/api";
import { CarOwner } from "@/types/car-listing";
import type { FC } from "react";

export const UserAvatar: FC<{ user: CarOwner; size?: "small" | "default" | "large" | "extralarge" }> = ({ user, size = "default" }) => {

  const getInitials = () => {
    const firstInitial = user.fName?.charAt(0).toUpperCase() || '';
    const lastInitial = user.lName?.charAt(0).toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  const sizeClasses = {
    small: "h-8 w-8",
    default: "h-10 w-10",
    large: "h-12 w-12",
    extralarge: " h-24 w-24",
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage 
        src={`${baseUrl}${user.picture ?? undefined}`} 
        alt={`${user.fName} ${user.lName}`} 
      />
      <AvatarFallback>{getInitials()}</AvatarFallback>
    </Avatar>
  );
}

