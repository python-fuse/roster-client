import { useAuth } from "@/context/AuthContext";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { StaffDashboard } from "@/components/dashboard/StaffDashboard";

const Dashboard = () => {
  const { state } = useAuth();

  // Show loading state if user data is not loaded yet
  if (!state.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  if ((state.user.role as any) === 0 || state.user.role === "ADMIN") {
    // ADMIN
    return <AdminDashboard />;
  } else if (
    (state.user.role as any) === 2 ||
    state.user.role === "SUPERVISOR"
  ) {
    // SUPERVISOR - can use admin dashboard
    return <AdminDashboard />;
  } else {
    // STAFF (default)
    return <StaffDashboard />;
  }
};

export default Dashboard;
