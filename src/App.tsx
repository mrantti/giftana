
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Layout
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AuthForm from "./components/auth/AuthForm";

const queryClient = new QueryClient();

// Private route wrapper component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? (
    <motion.div 
      className="flex flex-col min-h-screen pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </motion.div>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Public layout wrapper
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div 
      className="flex flex-col min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </motion.div>
  );
};

// Auth layout
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      {children}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/login" element={<AuthLayout><AuthForm /></AuthLayout>} />
              <Route path="/chat" element={<PublicLayout><Chat /></PublicLayout>} />
              <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
