import { Bell, Check } from "lucide-react";
import io, { Socket } from "socket.io-client";
import React, { useEffect, useState } from "react";
import { APIService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { Notification } from "@/types/definitions";
import NotificationCard from "./NotificationCard";
import { Button } from "../ui/button";

export const Notifications: React.FC = () => {
  const [socket, setSocket] = useState<Socket>();
  const [notifications, setNotifications] = useState<Notification[]>();
  const auth = useAuth();

  const {
    state: { user },
  } = auth;

  useEffect(() => {
    if (!socket) {
      setSocket(io("ws://localhost:5000"));
    }

    socket?.on("connect", () => {
      console.log("Connected");
    });

    socket?.emit("join", user!.id);

    socket?.on("notification", (data) => {
      setNotifications((prev) => [...prev!, data]);
    });

    return () => {
      socket?.close();
    };
  }, [socket, setNotifications]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const initNotifications = (
        await APIService.getUserNotifications(user?.id!)
      ).data.notifications as unknown as Notification[];

      setNotifications(initNotifications);
    };
    fetchNotifications();
  }, []);

  if (!notifications)
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="fill-blue-400 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-500">
            When you receive notifications, they'll appear here.
          </p>
        </div>
      </div>
    );

  const renderNotifications = notifications.map((notification) => (
    <NotificationCard key={notification.id} notification={notification} />
  ));

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div className="">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              Stay updated with the latest announcements and updates
            </p>
          </div>
          <Button className="bg-blue-300 text-black flex flex-row gap-2 hover:text-white hover:bg-blue-300 active:scale-[0.9]">
            <Check /> Mark all as read
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm flex gap-4 flex-col border border-gray-200 p-3">
          {renderNotifications}
        </div>
      </div>
    </div>
  );
};
