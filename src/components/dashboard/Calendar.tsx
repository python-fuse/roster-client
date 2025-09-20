import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import type { View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-styles.css";

import { APIService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { Assignment, CalendarEvent } from "@/types/definitions";
import { Shift } from "@/types/definitions";
import { getShiftColor, getShiftName } from "@/lib/utils";

// Setup the localizer for BigCalendar
const localizer = momentLocalizer(moment);

export const Calendar: React.FC = () => {
  const { state: authState } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  // Fetch user assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!authState.user) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await APIService.getUserAssignments(authState.user.id);
        console.log(response.data);

        setAssignments((response.data as any).assignments);
      } catch (error: any) {
        console.error("Failed to fetch assignments:", error);
        setError(error.response?.data?.message || "Failed to load assignments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [authState.user]);

  // Transform assignments to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return assignments
      .filter((assignment) => assignment.dutyRoster)
      .map((assignment) => {
        const dutyRoster = assignment.dutyRoster!;
        const date = new Date(dutyRoster.date);

        // Set times based on shift
        let startHour = 8,
          endHour = 16; // Default: morning shift
        if (dutyRoster.shift === Shift.EVENING) {
          startHour = 16;
          endHour = 24;
        } else if (dutyRoster.shift === Shift.NIGHT) {
          startHour = 0;
          endHour = 8;
        }

        const start = new Date(date);
        start.setHours(startHour, 0, 0, 0);

        const end = new Date(date);
        end.setHours(endHour, 0, 0, 0);

        return {
          id: assignment.id,
          title: `${getShiftName(dutyRoster.shift)} Shift`,
          start,
          end,
          resource: assignment,
          allDay: false,
        };
      });
  }, [assignments]);

  // Custom event style getter
  const eventStyleGetter = (event: CalendarEvent) => {
    const assignment = event.resource;
    const shift = assignment?.dutyRoster?.shift;

    return {
      style: {
        backgroundColor: shift ? getShiftColor(shift) : "#6B7280",
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  // Handle event selection
  const handleSelectEvent = (event: CalendarEvent) => {
    const assignment = event.resource;
    if (assignment && assignment.dutyRoster) {
      alert(`
        Assignment Details:
        Date: ${moment(assignment.dutyRoster.date).format("MMMM Do, YYYY")}
        Shift: ${getShiftName(assignment.dutyRoster.shift)}
        Assigned by: ${assignment.assignedBy?.name || "Unknown"}
        Time: ${moment(event.start).format("HH:mm")} - ${moment(
        event.end
      ).format("HH:mm")}
      `);
    }
  };

  // Handle slot selection (clicking on empty time slots)
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    console.log("Selected slot:", { start, end });
    // You could implement creating new assignments here if user has permission
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Assignment Calendar
          </h1>
          <p className="text-gray-600 mt-1">
            View your scheduled assignments and shifts
          </p>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center">
              <div
                className="w-4 h-4 rounded mr-2"
                style={{ backgroundColor: getShiftColor(Shift.MORNING) }}
              ></div>
              <span className="text-sm text-gray-600">
                Morning Shift (8AM - 4PM)
              </span>
            </div>
            <div className="flex items-center">
              <div
                className="w-4 h-4 rounded mr-2"
                style={{ backgroundColor: getShiftColor(Shift.EVENING) }}
              ></div>
              <span className="text-sm text-gray-600">
                Evening Shift (4PM - 12AM)
              </span>
            </div>
            <div className="flex items-center">
              <div
                className="w-4 h-4 rounded mr-2"
                style={{ backgroundColor: getShiftColor(Shift.NIGHT) }}
              ></div>
              <span className="text-sm text-gray-600">
                Night Shift (12AM - 8AM)
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            popup
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            defaultView={Views.MONTH}
            step={60}
            showMultiDayTimes
            messages={{
              next: "Next",
              previous: "Previous",
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
              agenda: "Agenda",
              date: "Date",
              time: "Time",
              event: "Assignment",
              noEventsInRange: "No assignments in this range",
              showMore: (total: number) => `+${total} more`,
            }}
            formats={{
              timeGutterFormat: "HH:mm",
              eventTimeRangeFormat: ({ start, end }: any) =>
                `${moment(start).format("HH:mm")} - ${moment(end).format(
                  "HH:mm"
                )}`,
              agendaTimeFormat: "HH:mm",
              agendaTimeRangeFormat: ({ start, end }: any) =>
                `${moment(start).format("HH:mm")} - ${moment(end).format(
                  "HH:mm"
                )}`,
            }}
          />
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">
                  Total Assignments
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {assignments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">This Week</p>
                <p className="text-lg font-semibold text-gray-900">
                  {
                    events.filter((event) => {
                      const weekStart = moment().startOf("week");
                      const weekEnd = moment().endOf("week");
                      return moment(event.start).isBetween(
                        weekStart,
                        weekEnd,
                        null,
                        "[]"
                      );
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.5 7.5a1.5 1.5 0 113 0v4.25a.75.75 0 01-1.5 0V7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Next 7 Days</p>
                <p className="text-lg font-semibold text-gray-900">
                  {
                    events.filter((event) => {
                      const now = moment();
                      const nextWeek = moment().add(7, "days");
                      return moment(event.start).isBetween(
                        now,
                        nextWeek,
                        null,
                        "[]"
                      );
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
