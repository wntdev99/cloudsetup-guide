import type { ReactNode } from 'react';

interface StepProps {
  number: number;
  title: string;
  estimatedMinutes?: number;
  children: ReactNode;
}

export function Step({ number, title, estimatedMinutes, children }: StepProps) {
  return (
    <section className="mb-12 scroll-mt-header" id={`step-${number}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
          {number}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {estimatedMinutes && (
            <span className="text-sm text-muted-foreground">{estimatedMinutes}분 소요</span>
          )}
        </div>
      </div>
      <div className="pl-13">{children}</div>
    </section>
  );
}
