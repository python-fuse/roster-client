import React from "react";
import { useNotifications } from "@/context/NotificationContext";
import { useSocket } from "@/context/SocketContext";
import { MARKASREAD } from "@/lib/events";
import { useAuth } from "@/context/AuthContext";

export const Notifications: React.FC = () => {
  const { state, markAllAsRead } = useNotifications();
  const { notifications, unreadCount, isLoading, error } = state;

  const { socket } = useSocket();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleMarkAsRead = async (id: string) => {
    // try {
    //   await markAsRead(id);
    // } catch (error) {
    //   console.error("Failed to mark notification as read:", error);
    // }

    socket?.emit(MARKASREAD, id);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              Stay updated with the latest announcements and updates
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {notifications.reverse().map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                    !notification.read
                      ? "bg-blue-50 border-l-4 border-blue-400"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="ml-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-500">
                When you receive notifications, they'll appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// const DebugSocketStatus = () => {
//   const { socket, isConnected } = useSocket();
//   const { state: authState } = useAuth();

//   return (
//     <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm">
//       <h3 className="font-bold mb-2">🔧 Debug Info:</h3>
//       <p>Socket Connected: {isConnected ? "✅" : "❌"}</p>
//       <p>Socket ID: {socket?.id || "No ID"}</p>
//       <p>User ID: {authState.user?.id || "No User"}</p>
//       <p>User Name: {authState.user?.name || "No Name"}</p>
//     </div>
//   );
// };
