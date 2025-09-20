import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CreateDutyRosterDialog } from "./CreateDutyRosterDialog";
import { APIService } from "@/services/api";
import type { DutyRoster } from "@/types/definitions";
import { getShiftName, getShiftColor } from "@/lib/utils";

export const Rosters: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [rosters, setRosters] = useState<DutyRoster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN";
  const isSupervisor = user?.role === "SUPERVISOR";
  const canManage = isAdmin || isSupervisor;

  useEffect(() => {
    fetchRosters();
  }, [user]);

  const fetchRosters = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (canManage) {
        // Admins and supervisors can see all rosters
        response = await APIService.getDutyRosters();
      } else {
        // Staff can only see their assigned rosters
        response = await APIService.getUserDutyRosters(user.id);
      }

      setRosters(response.data.data);
    } catch (error: any) {
      console.error("Failed to fetch rosters:", error);
      setError(error.response?.data?.message || "Failed to load rosters");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    fetchRosters(); // Refresh the rosters list
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Create Roster
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {rosters.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shift
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    {canManage && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rosters.map((roster) => (
                    <tr key={roster.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(roster.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-3"
                            style={{
                              backgroundColor: getShiftColor(roster.shift),
                            }}
                          ></div>
                          <span className="text-sm text-gray-900">
                            {getShiftName(roster.shift)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            new Date(roster.date) > new Date()
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {new Date(roster.date) > new Date()
                            ? "Upcoming"
                            : "Past"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(roster.createdAt).toLocaleDateString()}
                      </td>
                      {canManage && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
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
          )}
        </div>

        {/* Create Duty Roster Dialog */}
        <CreateDutyRosterDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
};
