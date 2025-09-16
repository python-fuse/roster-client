import React from "react";
// import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Array<"ADMIN" | "SUPERVISOR" | "STAFF">;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  // requiredRoles = [],
}) => {
  // if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  );
  // }

  return <>{children}</>;
};
