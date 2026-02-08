'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console (in production, send to error tracking service)
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="container py-20 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">문제가 발생했습니다</h1>
        <p className="text-lg text-muted-foreground mb-8">
          페이지를 불러오는 중에 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-muted rounded-lg text-left">
            <p className="font-mono text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
            {error.stack && (
              <pre className="mt-2 text-xs overflow-x-auto">
                {error.stack}
              </pre>
            )}
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>다시 시도</Button>
          <Button variant="outline" onClick={() => window.location.href = '/ko'}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}
