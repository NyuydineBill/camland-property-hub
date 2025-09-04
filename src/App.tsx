import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import PropertyMapPage from "./pages/PropertyMap";
import AddProperty from "./pages/AddProperty";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/map" element={
            <MainLayout>
              <PropertyMapPage />
            </MainLayout>
          } />
          <Route path="/properties/add" element={
            <MainLayout>
              <AddProperty />
            </MainLayout>
          } />
          <Route path="/properties" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/verification" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/transfers" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/commissions" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/community" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/settings" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
