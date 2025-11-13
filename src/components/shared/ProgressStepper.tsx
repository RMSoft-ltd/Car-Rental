import React from "react";
import clsx from "clsx";

interface Step {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function ProgressStepper({
  steps,
  currentStep,
  className,
}: ProgressStepperProps) {
  return (
    <div className={clsx("flex items-center justify-between w-full", className)}>
      {steps.map((step, index) => {
        const isActive = index <= currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isActive || isCompleted
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {step.icon}
              </div>
              <span
                className={clsx(
                  "text-xs font-medium mt-2 transition-colors",
                  isActive || isCompleted ? "text-black" : "text-gray-500"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  "h-0.5 flex-1 mx-4 transition-colors",
                  isCompleted ? "bg-black" : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
