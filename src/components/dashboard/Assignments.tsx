import React from "react";
import { useAuth } from "@/context/AuthContext";

export const Assignments: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;

  const isAdmin = (user?.role as any) === 0 || user?.role === "ADMIN";
  const isSupervisor = (user?.role as any) === 2 || user?.role === "SUPERVISOR";
  const canManage = isAdmin || isSupervisor;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {canManage ? "Assignments Management" : "My Assignments"}
            </h1>
            <p className="text-gray-600 mt-1">
              {canManage
                ? "Create and manage duty assignments for all staff"
                : "View your assigned duties and schedules"}
            </p>
          </div>
          {canManage && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
              Create Assignment
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {canManage
                  ? "No assignments created yet"
                  : "No assignments assigned"}
              </h3>
              <p className="text-gray-500">
                {canManage
                  ? "Create your first assignment to get started."
                  : "When you're assigned duties, they'll appear here."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
