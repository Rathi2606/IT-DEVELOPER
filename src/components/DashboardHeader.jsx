
import React from "react";
import { Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import NotificationPanel from "./NotificationPanel";

const DashboardHeader = ({ user }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
              TaskLane
            </h1>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <NotificationPanel />
            
            <Link
              to="/settings"
              aria-label="Open settings"
              className="p-2 text-gray-400 hover:text-gray-500 transition"
            >
              <Settings className="h-5 w-5" />
            </Link>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
