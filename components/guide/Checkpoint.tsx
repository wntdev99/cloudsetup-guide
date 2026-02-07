'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CheckpointProps {
  children: string;
}

export function Checkpoint({ children }: CheckpointProps) {
  const [checked, setChecked] = useState<boolean | null>(null);

  return (
    <div className="my-6 p-4 border-2 border-dashed rounded-lg bg-card">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🎯</span>
        <div className="flex-1">
          <p className="font-medium mb-3">{children}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={checked === true ? 'default' : 'outline'}
              onClick={() => setChecked(true)}
            >
              ✓ 확인했어요
            </Button>
            <Button
              size="sm"
              variant={checked === false ? 'destructive' : 'outline'}
              onClick={() => setChecked(false)}
            >
              ✗ 문제가 있어요
            </Button>
          </div>
          {checked === false && (
            <p className="mt-3 text-sm text-muted-foreground">
              이전 단계를 다시 확인하거나, 댓글로 질문해주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
