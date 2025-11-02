import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import UserListItem from "./UserListItem";
import ProfileModal from "./ProfileModal";
import { LogOut, Users, User as UserIcon, Settings } from "lucide-react";

const Sidebar: React.FC = () => {
  const { users, isUsersLoading, getUsers, selectedUser, setSelectedUser } =
    useChatStore();
  const { user: currentUser, logout } = useAuthStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="w-full md:w-80 h-full bg-sidebar-bg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <div className="w-10 h-10 rounded-full bg-dark-bg flex items-center justify-center">
              {currentUser?.profilePic ? (
                <img
                  src={currentUser.profilePic}
                  alt={currentUser.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">
                {currentUser?.fullName}
              </h3>
              <p className="text-white/70 text-xs truncate">
                {currentUser?.bio}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={logout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/90">
          <Users className="w-4 h-4" />
          <h2 className="font-semibold text-sm">Messages</h2>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {isUsersLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-white/70 px-4">
            <Users className="w-12 h-12 mb-2" />
            <p className="text-sm text-center">No users available</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {users.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                isSelected={selectedUser?._id === user._id}
                onClick={() => setSelectedUser(user)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
