'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

interface DevTipProps {
  children: ReactNode;
}

export function DevTip({ children }: DevTipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4 border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-muted hover:bg-muted/80 transition-colors flex items-center justify-between"
      >
        <span className="font-medium flex items-center gap-2">
          💻 <span>개발자 팁</span>
        </span>
        <span className="text-muted-foreground">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-card border-t">
          <div className="text-sm">{children}</div>
        </div>
      )}
    </div>
  );
}
