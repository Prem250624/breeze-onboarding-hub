
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboarding } from "@/contexts/OnboardingContext";
import OnboardingLayout from "@/components/OnboardingLayout";
import OnboardingStepIndicator from "@/components/OnboardingStepIndicator";
import { useAuth } from "@/contexts/AuthContext";
import { useApplication } from "@/hooks/useApplication";

const Agreement = () => {
  const { agreeToTerms } = useOnboarding(); // Keep for backwards compatibility
  const { user } = useAuth();
  const { application, isLoading, updateApplication } = useApplication();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if already agreed to terms
  useEffect(() => {
    if (application?.has_agreed_to_terms) {
      setAgreed(true);
    }
  }, [application]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return null; // Or loading spinner
  }

  const handleContinue = async () => {
    if (!agreed) {
      toast({
        variant: "destructive",
        title: "Agreement required",
        description: "Please agree to the terms and conditions to continue.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await updateApplication({ has_agreed_to_terms: true });
      // For backward compatibility
      agreeToTerms();
      navigate("/profile-info");
    } catch (error) {
      console.error("Error updating agreement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { name: "Agreement", status: "current" as const },
    { name: "Profile", status: "upcoming" as const },
    { name: "Documents", status: "upcoming" as const },
    { name: "Review", status: "upcoming" as const },
  ];

  return (
    <OnboardingLayout
      title="Terms & Conditions"
      subtitle="Please read and accept the terms to continue"
    >
      <OnboardingStepIndicator steps={steps} />

      <Card>
        <CardContent className="p-6 text-onboarding-gray-700">
          <div className="prose max-w-none mb-8">
            <h3 className="text-xl font-semibold mb-4">Terms and Conditions of Employment</h3>
            
            <p className="mb-4">
              Welcome to Breeze Industries Inc. This document outlines the terms and conditions of your potential employment with our company. 
              By proceeding with this application, you acknowledge and agree to the following:
            </p>
            
            <ol className="list-decimal list-outside pl-5 space-y-3">
              <li>
                <strong>Application Accuracy:</strong> All information provided in this application process must be true, complete, and accurate. 
                Any misrepresentations may result in termination of your application or employment.
              </li>
              
              <li>
                <strong>Document Verification:</strong> You agree to provide all necessary documentation to verify your identity, 
                educational qualifications, and previous employment history. These documents will be subject to verification.
              </li>
              
              <li>
                <strong>Background Check:</strong> You consent to a background check including criminal history, credit history (if applicable to the position), 
                and verification of your employment history and educational credentials.
              </li>
              
              <li>
                <strong>Data Privacy:</strong> You consent to the collection, processing, and storage of your personal information for employment purposes 
                in accordance with applicable data protection laws.
              </li>
              
              <li>
                <strong>Company Policies:</strong> If employed, you agree to comply with all company policies, procedures, and codes of conduct, 
                which may be updated from time to time.
              </li>
              
              <li>
                <strong>Confidentiality:</strong> You agree to maintain the confidentiality of any proprietary or sensitive information you may access 
                during the application process or subsequent employment.
              </li>
              
              <li>
                <strong>At-Will Employment:</strong> If employed, unless otherwise specified in a written employment agreement, your employment will be "at-will," 
                meaning either you or the company may terminate the employment relationship at any time, with or without cause or notice.
              </li>
              
              <li>
                <strong>Probationary Period:</strong> If employed, you may be subject to a probationary period during which your performance and fit will be evaluated.
              </li>
            </ol>
            
            <p className="mt-6">
              By checking the box below, you acknowledge that you have read, understood, and agree to these terms and conditions.
            </p>
          </div>
          
          <div className="flex items-start mb-8">
            <Checkbox 
              id="terms" 
              checked={agreed} 
              onCheckedChange={(checked) => setAgreed(checked === true)}
              className="mt-1"
            />
            <label htmlFor="terms" className="ml-2 text-base font-medium cursor-pointer">
              I have read and agree to the terms and conditions of employment.
            </label>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleContinue} 
              disabled={!agreed || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
};

export default Agreement;
