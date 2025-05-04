
import React from "react";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepInfo {
  name: string;
  status: "completed" | "current" | "upcoming";
  href?: string;
}

interface OnboardingStepIndicatorProps {
  steps: StepInfo[];
}

const OnboardingStepIndicator: React.FC<OnboardingStepIndicatorProps> = ({ steps }) => {
  return (
    <div className="my-8">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => (
          <li 
            key={step.name}
            className={cn(
              "flex items-center",
              index < steps.length - 1 ? "w-full" : "",
              step.status === "completed" ? "text-onboarding-blue" : 
              step.status === "current" ? "text-onboarding-teal" : 
              "text-onboarding-gray-300"
            )}
          >
            <div className="flex flex-col items-center">
              {step.status === "completed" ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Circle className={cn(
                  "w-6 h-6",
                  step.status === "current" && "fill-onboarding-light-blue stroke-onboarding-teal"
                )} />
              )}
              <span className={cn(
                "text-xs mt-1",
                step.status === "current" ? "font-medium" : 
                step.status === "upcoming" ? "text-onboarding-gray-300" : ""
              )}>
                {step.name}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "w-full h-0.5 mx-2",
                step.status === "completed" ? "bg-onboarding-blue" : "bg-onboarding-gray-200"
              )} />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default OnboardingStepIndicator;
