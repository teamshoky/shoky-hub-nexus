
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            {/* Placeholder routes for future implementation */}
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">User Management</h1>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'hr_admin', 'developer']}>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Task Management</h1>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/content"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'social_media_admin']}>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Content Planning</h1>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Analytics</h1>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
