import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  Users,
  ClipboardList,
  Bell,
  UserCircle,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Array<"ADMIN" | "SUPERVISOR" | "STAFF">;
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "SUPERVISOR", "STAFF"],
  },
  {
    name: "Duty Rosters",
    href: "/rosters",
    icon: Calendar,
    roles: ["ADMIN", "SUPERVISOR", "STAFF"],
  },
  {
    name: "Assignments",
    href: "/assignments",
    icon: ClipboardList,
    roles: ["ADMIN", "SUPERVISOR", "STAFF"],
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    roles: ["ADMIN", "SUPERVISOR"],
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    roles: ["ADMIN", "SUPERVISOR", "STAFF"],
  },
  {
    name: "Profile",
    href: "/profile",
    icon: UserCircle,
    roles: ["ADMIN", "SUPERVISOR", "STAFF"],
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const filteredNavigation = navigation.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        "mr-3 flex-shrink-0 h-6 w-6",
                        isActive ? "text-gray-300" : "text-gray-400"
                      )}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
