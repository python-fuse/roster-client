import React from "react";
import { useSocket } from "@/context/SocketContext";
import { useNotifications } from "@/context/NotificationContext";
import type { Notification } from "@/types/definitions";

export const SocketDebug: React.FC = () => {
  const { socket, isConnected } = useSocket();
  const { dispatch } = useNotifications();

  const sendTestNotification = () => {
    if (!socket?.connected) {
      alert("Socket not connected!");
      return;
    }

    // Simulate receiving a new notification (for testing)
    const testNotification: Notification = {
      id: `test-${Date.now()}`,
      title: "Test Notification",
      message: "This is a test notification sent via socket",
      type: "INFO",
      read: false,
      userId: "test-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add the notification directly to test the UI
    dispatch({ type: "ADD_NOTIFICATION", payload: testNotification });
  };

  const emitTestEvent = () => {
    if (!socket?.connected) {
      alert("Socket not connected!");
      return;
    }

    // Emit a test event to the server
    socket.emit("test", { message: "Hello from client!" });
    console.log("📤 Sent test event to server");
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">🔌 Socket Debug</h3>
      
      <div className="space-y-2 mb-4">
        <p>
          <strong>Socket Connected:</strong>{" "}
          <span className={isConnected ? "text-green-600" : "text-red-600"}>
            {isConnected ? "✅ Yes" : "❌ No"}
          </span>
        </p>
        <p>
          <strong>Socket ID:</strong>{" "}
          <span className="font-mono text-sm">
            {socket?.id || "Not connected"}
          </span>
        </p>
      </div>

      <div className="space-x-2">
        <button
          onClick={sendTestNotification}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          📱 Add Test Notification
        </button>
        <button
          onClick={emitTestEvent}
          disabled={!socket?.connected}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
        >
          📤 Send Test Event
        </button>
      </div>
    </div>
  );
};
