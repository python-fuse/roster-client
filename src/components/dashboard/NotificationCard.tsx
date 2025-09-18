import type { Notification } from "@/types/definitions";
import { Bell } from "lucide-react";
import React from "react";

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
}) => {
  return (
    <div
      className={`flex p-2 items-center gap-3  text-blue-500  border-blue-200 border rounded-md " ${
        notification.read ? readStyle : unReadStyle
      }
          `}
    >
      <Bell size={32} className="text-blue-600 fill-blue-600" />
      <div>
        <h3 className="text-xl font-bold ">{notification.title}</h3>
        <p>{notification.message}</p>
      </div>
    </div>
  );
};

export default NotificationCard;

const readStyle = "bg-white";
const unReadStyle = "bg-blue-200/20";
