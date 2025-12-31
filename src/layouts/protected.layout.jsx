import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/DashboardHeader";

const ProtectedLayout = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  // Wait for auth to load
  if (!isLoaded) {
    return null; // or a loader
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <SidebarProvider>
      {/* ROOT CONTAINER — MUST HAVE w-screen */}
      <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader user={user} />

          {/* Page content */}
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
