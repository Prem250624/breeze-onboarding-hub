
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import OnboardingLayout from "@/components/OnboardingLayout";
import OnboardingStepIndicator from "@/components/OnboardingStepIndicator";

const Agreement = () => {
  const { agreeToTerms, isLoggedIn } = useOnboarding();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [hasAgreedToPrivacy, setHasAgreedToPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const handleContinue = () => {
    if (!hasAgreedToTerms || !hasAgreedToPrivacy) {
      toast({
        variant: "destructive",
        title: "Agreement required",
        description: "Please agree to both terms of service and privacy policy to continue.",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      agreeToTerms();
      toast({
        title: "Agreement accepted",
        description: "Thank you for accepting our terms and conditions.",
      });
      navigate("/profile-info");
      setIsSubmitting(false);
    }, 1000);
  };

  const steps = [
    { name: "Agreement", status: "current" as const },
    { name: "Profile", status: "upcoming" as const },
    { name: "Documents", status: "upcoming" as const },
    { name: "Review", status: "upcoming" as const },
  ];

  return (
    <OnboardingLayout
      title="Terms and Agreements"
      subtitle="Please review and accept our terms before proceeding"
    >
      <OnboardingStepIndicator steps={steps} />

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Terms of Service</h3>
            <div className="h-64 overflow-y-auto border rounded-md p-4 mb-4 bg-onboarding-gray-50 text-sm">
              <p className="mb-4">
                This Employee Onboarding Agreement ("Agreement") is entered into between the Company and the Employee.
              </p>
              
              <h4 className="font-semibold mb-2">1. Purpose</h4>
              <p className="mb-4">
                This Agreement outlines the terms and conditions of the employee onboarding process, including the collection, storage, and use of personal information and documents.
              </p>
              
              <h4 className="font-semibold mb-2">2. Information Collection</h4>
              <p className="mb-4">
                The Employee agrees that the Company may collect personal information including but not limited to name, address, contact details, educational qualifications, and employment history for the purpose of employment and onboarding.
              </p>
              
              <h4 className="font-semibold mb-2">3. Document Submission</h4>
              <p className="mb-4">
                The Employee agrees to provide accurate and authentic documents as required by the Company for verification purposes. The Company reserves the right to verify the authenticity of the documents and reject any application based on discrepancies.
              </p>
              
              <h4 className="font-semibold mb-2">4. Confidentiality</h4>
              <p className="mb-4">
                The Employee agrees to maintain the confidentiality of any proprietary information shared during the onboarding process. Similarly, the Company agrees to protect the Employee's personal information in accordance with applicable privacy laws.
              </p>
              
              <h4 className="font-semibold mb-2">5. Changes to Agreement</h4>
              <p>
                The Company reserves the right to modify this Agreement at any time. The Employee will be notified of any material changes to the Agreement and may be required to provide renewed consent.
              </p>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="terms" 
                checked={hasAgreedToTerms} 
                onCheckedChange={() => setHasAgreedToTerms(!hasAgreedToTerms)} 
              />
              <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                I have read and agree to the Terms of Service
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Privacy Policy</h3>
            <div className="h-64 overflow-y-auto border rounded-md p-4 mb-4 bg-onboarding-gray-50 text-sm">
              <p className="mb-4">
                This Privacy Policy explains how we collect, use, and protect your personal information during the onboarding process.
              </p>
              
              <h4 className="font-semibold mb-2">1. Information We Collect</h4>
              <p className="mb-4">
                We collect personal information including name, contact details, educational qualifications, employment history, and copies of identification documents and certificates.
              </p>
              
              <h4 className="font-semibold mb-2">2. How We Use Your Information</h4>
              <p className="mb-4">
                Your information is used for employee verification, background checks, payroll processing, benefits administration, and compliance with legal requirements.
              </p>
              
              <h4 className="font-semibold mb-2">3. Data Security</h4>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <h4 className="font-semibold mb-2">4. Data Retention</h4>
              <p className="mb-4">
                We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              
              <h4 className="font-semibold mb-2">5. Your Rights</h4>
              <p>
                You have the right to access, correct, or delete your personal information. To exercise these rights, please contact our HR department.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="privacy" 
                checked={hasAgreedToPrivacy} 
                onCheckedChange={() => setHasAgreedToPrivacy(!hasAgreedToPrivacy)} 
              />
              <label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                I have read and agree to the Privacy Policy
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleContinue} 
            disabled={!hasAgreedToTerms || !hasAgreedToPrivacy || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "I Agree & Continue"}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default Agreement;
