'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  totalSteps: number;
}

export function ProgressBar({ totalSteps }: ProgressBarProps) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const steps = document.querySelectorAll('[id^="step-"]');
      let current = 1;

      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2) {
          current = index + 1;
        }
      });

      setCurrentStep(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
