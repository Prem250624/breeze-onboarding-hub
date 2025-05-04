
import React, { createContext, useContext, useState, ReactNode } from "react";

// Application status types
export type ApplicationStatus = 
  | "pending" 
  | "under_review" 
  | "interview_scheduled" 
  | "selected" 
  | "rejected";

// Document upload status
export type DocumentStatus = "not_uploaded" | "uploaded" | "verified" | "rejected";

// Document types that can be uploaded
export type DocumentType = 
  | "profile_image" 
  | "class_10_certificate" 
  | "class_12_certificate" 
  | "degree_certificate" 
  | "resume" 
  | "experience_certificate";

// Document information structure
export interface DocumentInfo {
  type: DocumentType;
  status: DocumentStatus;
  fileName?: string;
  uploadDate?: Date;
  notes?: string;
}

// User profile information
export interface ProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth?: Date;
}

// Context state structure
interface OnboardingContextState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  hasAgreed: boolean;
  applicationStatus: ApplicationStatus;
  profileInfo: ProfileInfo | null;
  documents: Record<DocumentType, DocumentInfo>;
  
  // Actions
  login: (isAdmin?: boolean) => void;
  logout: () => void;
  agreeToTerms: () => void;
  updateProfileInfo: (info: ProfileInfo) => void;
  updateDocumentStatus: (type: DocumentType, status: DocumentStatus, fileName?: string) => void;
  updateApplicationStatus: (status: ApplicationStatus) => void;
}

// Default document statuses
const defaultDocuments: Record<DocumentType, DocumentInfo> = {
  profile_image: { type: "profile_image", status: "not_uploaded" },
  class_10_certificate: { type: "class_10_certificate", status: "not_uploaded" },
  class_12_certificate: { type: "class_12_certificate", status: "not_uploaded" },
  degree_certificate: { type: "degree_certificate", status: "not_uploaded" },
  resume: { type: "resume", status: "not_uploaded" },
  experience_certificate: { type: "experience_certificate", status: "not_uploaded" },
};

// Default profile info
const defaultProfileInfo: ProfileInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

// Create context with default values
const OnboardingContext = createContext<OnboardingContextState>({
  isLoggedIn: false,
  isAdmin: false,
  hasAgreed: false,
  applicationStatus: "pending",
  profileInfo: null,
  documents: defaultDocuments,
  
  login: () => {},
  logout: () => {},
  agreeToTerms: () => {},
  updateProfileInfo: () => {},
  updateDocumentStatus: () => {},
  updateApplicationStatus: () => {},
});

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>("pending");
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [documents, setDocuments] = useState<Record<DocumentType, DocumentInfo>>(defaultDocuments);
  
  const login = (admin: boolean = false) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
  };
  
  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setHasAgreed(false);
    setProfileInfo(null);
    setDocuments(defaultDocuments);
  };
  
  const agreeToTerms = () => {
    setHasAgreed(true);
  };
  
  const updateProfileInfo = (info: ProfileInfo) => {
    setProfileInfo(info);
  };
  
  const updateDocumentStatus = (
    type: DocumentType, 
    status: DocumentStatus, 
    fileName?: string
  ) => {
    setDocuments(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        status,
        fileName,
        uploadDate: status === "uploaded" ? new Date() : prev[type].uploadDate
      }
    }));
  };
  
  const updateApplicationStatus = (status: ApplicationStatus) => {
    setApplicationStatus(status);
  };
  
  return (
    <OnboardingContext.Provider
      value={{
        isLoggedIn,
        isAdmin,
        hasAgreed,
        applicationStatus,
        profileInfo,
        documents,
        login,
        logout,
        agreeToTerms,
        updateProfileInfo,
        updateDocumentStatus,
        updateApplicationStatus,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
