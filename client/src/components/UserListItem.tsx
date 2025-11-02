import React from "react";
import { User } from "../types";
import { useChatStore } from "../store/useChatStore";
import { User as UserIcon } from "lucide-react";

interface UserListItemProps {
  user: User;
  isSelected: boolean;
  onClick: () => void;
}

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  isSelected,
  onClick,
}) => {
  const { unseenCounts, onlineUsers } = useChatStore();
  const unseenCount = unseenCounts[user._id] || 0;
  const isOnline = onlineUsers.includes(user._id);

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all hover:bg-white/10 ${
        isSelected ? "bg-white/20" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar with online indicator */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-dark-bg flex items-center justify-center overflow-hidden">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-6 h-6 text-white" />
            )}
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-sidebar-bg"></div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium text-sm truncate">
              {user.fullName}
            </h3>
            {unseenCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center">
                {unseenCount > 99 ? "99+" : unseenCount}
              </span>
            )}
          </div>
          <p className="text-white/70 text-xs truncate mt-0.5">
            {user.bio || "Hey there! I am using ChatApp"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
