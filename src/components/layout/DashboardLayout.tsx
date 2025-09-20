import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthAPI } from "@/api/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { state, dispatch } = useAuth();
  const { state: notificationState } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = state;

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side session
      await AuthAPI.logout();
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API call fails, clear local state
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    }
  };

  const isActive = (path: string) => location.pathname === path; // Notification Badge Component
  const NotificationBadge: React.FC<{ count: number }> = ({ count }) => {
    if (count === 0) return null;

    return (
      <span className="ml-auto inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white min-w-[20px] h-5">
        {count > 99 ? "99+" : count}
      </span>
    );
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        ),
      },
      {
        name: "Notifications",
        path: "/dashboard/notifications",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        ),
        showBadge: true,
      },
      {
        name: "Calendar",
        path: "/dashboard/calendar",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    ];

    // Staff can view assignments
    const staffItems = [
      ...baseItems,
      {
        name: "My Assignments",
        path: "/dashboard/assignments",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    ];

    // Admin and Supervisor can manage assignments and rosters
    const adminItems = [
      ...baseItems,
      {
        name: "Assignments",
        path: "/dashboard/assignments",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: "Rosters",
        path: "/dashboard/rosters",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: "Users",
        path: "/dashboard/users",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        ),
      },
    ];

    // Check user role and return appropriate items
    const isAdmin = (user?.role as any) === 0 || user?.role === "ADMIN";
    const isSupervisor =
      (user?.role as any) === 2 || user?.role === "SUPERVISOR";

    if (isAdmin || isSupervisor) {
      return adminItems;
    } else {
      return staffItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
          {/* Logo/Brand */}
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
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
            <h1 className="ml-3 text-xl font-bold text-gray-900">Roster</h1>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`${
                    isActive(item.path)
                      ? "bg-blue-50 border-r-2 border-blue-600 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-200`}
                >
                  <span
                    className={`${
                      isActive(item.path)
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 transition-colors duration-200`}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                  {/* Show notification badge if path is notifications and there are unread notifications */}
                  {item.path === "/dashboard/notifications" && (
                    <NotificationBadge count={notificationState.unreadCount} />
                  )}
                </button>
              ))}
            </nav>

            {/* User Profile Section */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(user?.role as any) === 0 || user?.role === "ADMIN"
                      ? "Admin"
                      : (user?.role as any) === 2 || user?.role === "SUPERVISOR"
                      ? "Supervisor"
                      : "Staff"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  title="Logout"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button - placeholder for future implementation */}
      <div className="md:hidden">
        {/* You can add a mobile hamburger menu here later */}
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};
