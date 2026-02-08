'use client';

import { useEffect, useState, useRef } from 'react';

interface ProgressBarProps {
  totalSteps: number;
}

export function ProgressBar({ totalSteps }: ProgressBarProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Use IntersectionObserver for better performance
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when element is at center of viewport
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepId = entry.target.id;
          const stepNumber = parseInt(stepId.replace('step-', ''), 10);
          if (!isNaN(stepNumber)) {
            setCurrentStep(stepNumber);
          }
        }
      });
    }, options);

    // Observe all step elements
    const steps = document.querySelectorAll('[id^="step-"]');
    steps.forEach((step) => {
      observerRef.current?.observe(step);
    });

    // Cleanup
    return () => {
      if (observerRef.current) {
        steps.forEach((step) => {
          observerRef.current?.unobserve(step);
        });
        observerRef.current.disconnect();
      }
    };
  }, []);

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
      <div className="container py-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium whitespace-nowrap">
            Step {currentStep} / {totalSteps}
          </span>
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
