
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  User,
  FileText,
  Calendar,
} from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import OnboardingLayout from "@/components/OnboardingLayout";
import OnboardingStepIndicator from "@/components/OnboardingStepIndicator";
import { useApplication } from "@/hooks/useApplication";

const ApplicationProgress = () => {
  const { 
    isLoggedIn, 
    hasAgreed, 
    profileInfo, 
    documents,
    applicationStatus
  } = useOnboarding();
  const navigate = useNavigate();
  const { application } = useApplication();

  // Redirect checks
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (!hasAgreed) {
      navigate("/agreement");
    } else if (!profileInfo) {
      navigate("/profile-info");
    } else {
      // If application is selected/approved, redirect to employee dashboard
      if (applicationStatus === "selected" || (application && application.status === "selected")) {
        navigate("/employee-dashboard");
      }
    }
  }, [isLoggedIn, hasAgreed, profileInfo, applicationStatus, application, navigate]);

  if (!isLoggedIn || !hasAgreed || !profileInfo) {
    return null;
  }

  // Check if all required documents are uploaded
  const requiredDocuments = ["profile_image", "class_10_certificate", "class_12_certificate", "degree_certificate", "resume"];
  const allDocumentsUploaded = requiredDocuments.every(
    docType => documents[docType as any].status !== "not_uploaded"
  );

  if (!allDocumentsUploaded) {
    navigate("/document-upload");
    return null;
  }

  const getStatusIcon = () => {
    switch (applicationStatus) {
      case "under_review":
        return <Clock className="w-12 h-12 text-yellow-500" />;
      case "interview_scheduled":
        return <Calendar className="w-12 h-12 text-blue-500" />;
      case "selected":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "rejected":
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (applicationStatus) {
      case "pending":
        return "Your application has been received and is pending review.";
      case "under_review":
        return "Your application is currently under review by our HR team.";
      case "interview_scheduled":
        return "Congratulations! Your interview has been scheduled. Please check your email for details.";
      case "selected":
        return "Congratulations! You have been selected. Please check your dashboard for further instructions.";
      case "rejected":
        return "We regret to inform you that your application has not been selected at this time.";
      default:
        return "Your application is being processed.";
    }
  };

  const steps = [
    { name: "Agreement", status: "completed" as const },
    { name: "Profile", status: "completed" as const },
    { name: "Documents", status: "completed" as const },
    { name: "Review", status: "current" as const },
  ];

  return (
    <OnboardingLayout
      title="Application Progress"
      subtitle="Track the status of your application"
    >
      <OnboardingStepIndicator steps={steps} />

      <div className="space-y-6">
        <Card className="border-2 border-onboarding-gray-200">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            {getStatusIcon()}
            <h3 className="text-xl font-bold mt-4">
              Application Status: {applicationStatus.replace("_", " ").charAt(0).toUpperCase() + applicationStatus.replace("_", " ").slice(1)}
            </h3>
            <p className="text-onboarding-gray-600 mt-2 max-w-lg">
              {getStatusMessage()}
            </p>

            {applicationStatus === "selected" && (
              <Button 
                className="mt-4"
                onClick={() => navigate("/employee-dashboard")}
              >
                Go to Dashboard
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 mr-2 text-onboarding-blue" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-onboarding-gray-600">Name: </span>
                  <span className="font-medium">{profileInfo.firstName} {profileInfo.lastName}</span>
                </p>
                <p className="text-sm">
                  <span className="text-onboarding-gray-600">Email: </span>
                  <span className="font-medium">{profileInfo.email}</span>
                </p>
                <p className="text-sm">
                  <span className="text-onboarding-gray-600">Phone: </span>
                  <span className="font-medium">{profileInfo.phone}</span>
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/profile-info")}
                  className="mt-2"
                >
                  Edit Information
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 mr-2 text-onboarding-blue" />
                <h3 className="text-lg font-semibold">Document Status</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(documents).map(([key, doc]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span>{key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <span className={`
                      ${doc.status === "verified" ? "text-green-600" : 
                        doc.status === "rejected" ? "text-red-600" : 
                        doc.status === "uploaded" ? "text-yellow-600" : "text-onboarding-gray-400"}
                      font-medium
                    `}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/document-upload")}
                  className="mt-2"
                >
                  View Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {applicationStatus === "rejected" && (
          <Card className="border-2 border-red-100">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2 text-red-600">Application Not Selected</h3>
              <p className="text-onboarding-gray-600">
                Thank you for your interest in our company. We appreciate the time you've taken to apply for this position. 
                While we were impressed with your qualifications, we have decided to move forward with other candidates 
                whose skills and experience better match our current needs.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate("/")}
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </OnboardingLayout>
  );
};

export default ApplicationProgress;
