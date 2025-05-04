
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface OnboardingLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showLogout?: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  title,
  subtitle,
  showLogout = true,
}) => {
  const { logout, isLoggedIn } = useOnboarding();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-onboarding-gray-50">
      <header className="bg-white border-b border-onboarding-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-onboarding-dark-blue">
              Breeze Onboarding Hub
            </h1>
          </div>
          {isLoggedIn && showLogout && (
            <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-onboarding-gray-800 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-onboarding-gray-600">{subtitle}</p>
            )}
          </div>

          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-onboarding-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-onboarding-gray-600">
          <p>&copy; {new Date().getFullYear()} Breeze Onboarding Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingLayout;
