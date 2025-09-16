import { createBrowserRouter } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import { Login } from "@/pages/Login";
import Register from "@/pages/Register";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
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
