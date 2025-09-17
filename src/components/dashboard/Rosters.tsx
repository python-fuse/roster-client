import React from "react";
import { useAuth } from "@/context/AuthContext";

export const Rosters: React.FC = () => {
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
              {canManage ? "Roster Management" : "Duty Rosters"}
            </h1>
            <p className="text-gray-600 mt-1">
              {canManage
                ? "Create and assign duty rosters for different departments"
                : "View your assigned duty rosters and schedules"}
            </p>
          </div>
          {canManage && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
              Create Roster
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {canManage ? "No rosters created yet" : "No rosters assigned"}
              </h3>
              <p className="text-gray-500">
                {canManage
                  ? "Create your first duty roster to organize staff schedules."
                  : "When you're assigned to rosters, they'll appear here."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
