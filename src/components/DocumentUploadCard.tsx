
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Check, X, AlertCircle } from "lucide-react";
import { DocumentInfo, DocumentType, DocumentStatus } from "@/contexts/OnboardingContext";
import { cn } from "@/lib/utils";

interface DocumentUploadCardProps {
  document: DocumentInfo;
  title: string;
  description: string;
  onUpload: (type: DocumentType, file: File) => void;
}

const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  document,
  title,
  description,
  onUpload,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onUpload(document.type, file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onUpload(document.type, file);
    }
  };

  const getStatusDisplay = () => {
    switch (document.status) {
      case "uploaded":
        return (
          <div className="flex items-center text-yellow-600">
            <AlertCircle size={16} className="mr-1" />
            <span>Pending verification</span>
          </div>
        );
      case "verified":
        return (
          <div className="flex items-center text-green-600">
            <Check size={16} className="mr-1" />
            <span>Verified</span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center text-red-600">
            <X size={16} className="mr-1" />
            <span>Rejected</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      "border-2 transition-all duration-200",
      isDragging ? "border-onboarding-blue border-dashed bg-onboarding-light-blue/20" : 
        document.status === "verified" ? "border-green-100" :
        document.status === "rejected" ? "border-red-100" :
        document.status === "uploaded" ? "border-yellow-100" :
        "border-onboarding-gray-200"
    )}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {document.status === "not_uploaded" ? (
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragging ? "border-onboarding-blue bg-onboarding-light-blue/20" : "border-onboarding-gray-300",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-onboarding-gray-600" />
              <p className="text-sm text-onboarding-gray-600">
                Drag and drop your file here or click to browse
              </p>
              <p className="text-xs text-onboarding-gray-600">
                PDF, JPG, or PNG (Max. 5MB)
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        ) : (
          <div className="p-4 bg-onboarding-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="mr-3">
                  {document.fileName && (
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {document.fileName}
                    </p>
                  )}
                  {document.uploadDate && (
                    <p className="text-xs text-onboarding-gray-600">
                      Uploaded on {document.uploadDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              {getStatusDisplay()}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {document.status !== "not_uploaded" && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm"
          >
            Replace file
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DocumentUploadCard;
