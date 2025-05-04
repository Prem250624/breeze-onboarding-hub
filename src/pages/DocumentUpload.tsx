
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useOnboarding, DocumentType } from "@/contexts/OnboardingContext";
import OnboardingLayout from "@/components/OnboardingLayout";
import OnboardingStepIndicator from "@/components/OnboardingStepIndicator";
import DocumentUploadCard from "@/components/DocumentUploadCard";

const DocumentUpload = () => {
  const { 
    isLoggedIn, 
    hasAgreed, 
    profileInfo, 
    documents, 
    updateDocumentStatus 
  } = useOnboarding();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect checks
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  if (!hasAgreed) {
    navigate("/agreement");
    return null;
  }

  if (!profileInfo) {
    navigate("/profile-info");
    return null;
  }

  const handleDocumentUpload = (type: DocumentType, file: File) => {
    // Check file size limit (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
      });
      return;
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF, JPG, or PNG file.",
      });
      return;
    }

    // Simulate file upload
    updateDocumentStatus(type, "uploaded", file.name);
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const handleContinue = () => {
    // Check if required documents are uploaded
    const requiredDocuments: DocumentType[] = [
      "profile_image",
      "class_10_certificate",
      "class_12_certificate",
      "degree_certificate",
      "resume"
    ];
    
    const missingDocuments = requiredDocuments.filter(
      docType => documents[docType].status === "not_uploaded"
    );
    
    if (missingDocuments.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing documents",
        description: "Please upload all required documents to continue.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      toast({
        title: "Documents submitted",
        description: "Your documents have been submitted successfully.",
      });
      navigate("/application-progress");
      setIsSubmitting(false);
    }, 1000);
  };

  const steps = [
    { name: "Agreement", status: "completed" as const },
    { name: "Profile", status: "completed" as const },
    { name: "Documents", status: "current" as const },
    { name: "Review", status: "upcoming" as const },
  ];

  return (
    <OnboardingLayout
      title="Document Upload"
      subtitle="Please upload the required documents to proceed"
    >
      <OnboardingStepIndicator steps={steps} />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentUploadCard
            document={documents.profile_image}
            title="Profile Image"
            description="Upload your recent passport-sized photograph"
            onUpload={handleDocumentUpload}
          />
          
          <DocumentUploadCard
            document={documents.class_10_certificate}
            title="Class 10 Certificate"
            description="Upload your class 10 marksheet or certificate"
            onUpload={handleDocumentUpload}
          />
          
          <DocumentUploadCard
            document={documents.class_12_certificate}
            title="Class 12 Certificate"
            description="Upload your class 12 marksheet or certificate"
            onUpload={handleDocumentUpload}
          />
          
          <DocumentUploadCard
            document={documents.degree_certificate}
            title="College Degree"
            description="Upload your college degree or final marksheet"
            onUpload={handleDocumentUpload}
          />
          
          <DocumentUploadCard
            document={documents.resume}
            title="Resume/CV"
            description="Upload your updated resume or CV"
            onUpload={handleDocumentUpload}
          />
          
          <DocumentUploadCard
            document={documents.experience_certificate}
            title="Experience Certificate (Optional)"
            description="Upload your experience certificates if applicable"
            onUpload={handleDocumentUpload}
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Document Requirements</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-onboarding-gray-600">
              <li>All documents must be in PDF, JPG, or PNG format</li>
              <li>Maximum file size: 5MB per document</li>
              <li>Documents must be clearly legible</li>
              <li>Ensure all details are visible and not cropped</li>
              <li>Experience certificate is optional if applicable</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => navigate("/profile-info")}>
            Back
          </Button>
          <Button onClick={handleContinue} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Documents"}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default DocumentUpload;
