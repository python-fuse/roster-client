import { createBrowserRouter } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import { Login } from "@/pages/Login";
import Register from "@/pages/Register";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Notifications } from "@/components/dashboard/Notifications";
import { Calendar } from "@/components/dashboard/Calendar";
import { Assignments } from "@/components/dashboard/Assignments";
import { Rosters } from "@/components/dashboard/Rosters";
import { Users } from "@/components/dashboard/Users";

// Create a wrapper component that uses DashboardLayout for specific routes
const DashboardPage = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardPage>
          <Dashboard />
        </DashboardPage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage>
          <Dashboard />
        </DashboardPage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/notifications",
    element: (
      <ProtectedRoute>
        <DashboardPage>
          <Notifications />
        </DashboardPage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/calendar",
    element: (
      <ProtectedRoute>
        <DashboardPage>
          <Calendar />
        </DashboardPage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/assignments",
    element: (
      <ProtectedRoute>
        <DashboardPage>
          <Assignments />
        </DashboardPage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/rosters",
    element: (
      <ProtectedRoute>
        <DashboardPage>
          <Rosters />
        </DashboardPage>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/users",
    element: (
      <ProtectedRoute>
        <DashboardPage>
          <Users />
        </DashboardPage>
      </ProtectedRoute>
    ),
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
