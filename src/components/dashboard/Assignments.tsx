import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CreateAssignmentDialog } from "./CreateAssignmentDialog";
import { APIService } from "@/services/api";
import type { Assignment } from "@/types/definitions";
import { getShiftName, getShiftColor } from "@/lib/utils";

export const Assignments: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN";
  const isSupervisor = user?.role === "SUPERVISOR";
  const canManage = isAdmin || isSupervisor;

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const fetchAssignments = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (canManage) {
        // Admins and supervisors can see all assignments
        response = await APIService.getAssignments();
      } else {
        // Staff can only see their own assignments
        response = await APIService.getUserAssignments(user.id);
      }

      // Handle the response structure
      const assignmentsData =
        (response.data as any).assignments || response.data;
      setAssignments(assignmentsData);
    } catch (error: any) {
      console.error("Failed to fetch assignments:", error);
      setError(error.response?.data?.message || "Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    fetchAssignments(); // Refresh the assignments list
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
              {canManage ? "Assignments Management" : "My Assignments"}
            </h1>
            <p className="text-gray-600 mt-1">
              {canManage
                ? "Create and manage duty assignments for all staff"
                : "View your assigned duties and schedules"}
            </p>
          </div>
          {canManage && (
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Create Assignment
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {assignments.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {canManage && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned User
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shift
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {canManage && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      {canManage && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.user?.name || "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {assignment.user?.email}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.dutyRoster?.date
                            ? formatDate(assignment.dutyRoster.date)
                            : "No Date"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {assignment.dutyRoster?.shift && (
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-3"
                              style={{
                                backgroundColor: getShiftColor(
                                  assignment.dutyRoster.shift
                                ),
                              }}
                            ></div>
                            <span className="text-sm text-gray-900">
                              {getShiftName(assignment.dutyRoster.shift)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.assignedBy?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            assignment.dutyRoster?.date &&
                            new Date(assignment.dutyRoster.date) > new Date()
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {assignment.dutyRoster?.date &&
                          new Date(assignment.dutyRoster.date) > new Date()
                            ? "Upcoming"
                            : "Past"}
                        </span>
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
          )}
        </div>

        {/* Create Assignment Dialog */}
        <CreateAssignmentDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
};
