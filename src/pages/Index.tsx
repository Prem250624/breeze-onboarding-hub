
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-onboarding-light-blue to-white">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-onboarding-dark-blue">Breeze Onboarding Hub</h1>
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="flex items-center gap-2"
            >
              <LogIn size={16} />
              <span>Login</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="max-w-md text-center md:text-left">
          <h2 className="text-4xl font-bold text-onboarding-dark-blue mb-4">
            Welcome to the Employee Onboarding System
          </h2>
          <p className="text-lg text-onboarding-gray-600 mb-8">
            Streamline your onboarding process with our easy-to-use platform. Upload documents, track your application status, and stay connected with your employer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button 
              onClick={() => navigate("/login")}
              size="lg"
              className="flex items-center gap-2"
            >
              Employee Login
              <ArrowRight size={16} />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/admin-login")}
              size="lg"
            >
              Admin Access
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-xl font-semibold text-onboarding-dark-blue mb-4">
            Onboarding Process
          </h3>
          <ol className="space-y-4">
            {[
              "Complete your profile",
              "Upload required documents",
              "Track application progress",
              "Access your dashboard"
            ].map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-onboarding-blue flex items-center justify-center text-white text-sm mr-3">
                  {index + 1}
                </span>
                <span className="text-onboarding-gray-600">{step}</span>
              </li>
            ))}
          </ol>
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

export default Index;
