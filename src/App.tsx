import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import PublicHome from "./pages/PublicHome";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./components/dashboards/UserDashboard";
import CommunityHeadDashboard from "./components/dashboards/CommunityHeadDashboard";
import BrokerDashboard from "./components/dashboards/BrokerDashboard";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import PropertyMapPage from "./pages/PropertyMap";
import AddProperty from "./pages/AddProperty";
import Properties from "./pages/Properties";
import PropertySearch from "./pages/PropertySearch";
import PropertyDetails from "./pages/PropertyDetails";
import EditProperty from "./pages/EditProperty";
import Verification from "./pages/Verification";
import Transfers from "./pages/Transfers";
import UserManagement from "./pages/UserManagement";
import PropertyManagement from "./pages/PropertyManagement";
import VerificationQueue from "./pages/VerificationQueue";
import ClientManagement from "./pages/ClientManagement";
import Appointments from "./pages/Appointments";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PublicHeader from "./components/layout/PublicHeader";

const queryClient = new QueryClient();

// Dashboard component that renders based on user role
const RoleBasedDashboard = () => {
  const { user } = useAuth();
  
  if (!user) return <Dashboard />; // Fallback to default dashboard
  
  switch (user.role) {
    case 'user':
      return <UserDashboard />;
    case 'owner':
      return <Dashboard />; // Property owner dashboard (existing)
    case 'community':
      return <CommunityHeadDashboard />;
    case 'broker':
      return <BrokerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Dashboard />;
  }
};

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Auth />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        isAuthenticated ? (
          <MainLayout>
            <RoleBasedDashboard />
          </MainLayout>
        ) : (
          <div>
            <PublicHeader />
            <PublicHome />
          </div>
        )
      } />
      
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <RoleBasedDashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/map" element={
        <ProtectedRoute>
          <MainLayout>
            <PropertyMapPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/properties/add" element={
        <ProtectedRoute>
          <MainLayout>
            <AddProperty />
          </MainLayout>
        </ProtectedRoute>
      } />
      

      <Route path="/properties" element={
        <ProtectedRoute>
          <MainLayout>
            <Properties />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/properties/:id" element={
        <ProtectedRoute>
          <MainLayout>
            <PropertyDetails />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/properties/:id/edit" element={
        <ProtectedRoute>
          <MainLayout>
            <EditProperty />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/properties/search" element={
        <ProtectedRoute>
          <MainLayout>
            <PropertySearch />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/verification" element={
        <ProtectedRoute>
          <MainLayout>
            <Verification />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/transfers" element={
        <ProtectedRoute>
          <MainLayout>
            <Transfers />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/commissions" element={
        <ProtectedRoute>
          <MainLayout>
            <RoleBasedDashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/community" element={
        <ProtectedRoute>
          <MainLayout>
            <RoleBasedDashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <MainLayout>
            <RoleBasedDashboard />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* Broker-specific routes */}
      <Route path="/clients" element={
        <ProtectedRoute>
          <MainLayout>
            <ClientManagement />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/appointments" element={
        <ProtectedRoute>
          <MainLayout>
            <Appointments />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <MainLayout>
            <AdminDashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <MainLayout>
            <UserManagement />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/properties" element={
        <ProtectedRoute>
          <MainLayout>
            <PropertyManagement />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/verification" element={
        <ProtectedRoute>
          <MainLayout>
            <VerificationQueue />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/financial" element={
        <ProtectedRoute>
          <MainLayout>
            <AdminDashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/system" element={
        <ProtectedRoute>
          <MainLayout>
            <AdminDashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
