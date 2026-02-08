'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GuideError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Guide page error:', error);
  }, [error]);

  return (
    <div className="container py-20 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">가이드를 불러올 수 없습니다</h1>
        <p className="text-lg text-muted-foreground mb-8">
          가이드를 불러오는 중에 문제가 발생했습니다.
          <br />
          가이드가 존재하지 않거나 일시적인 오류일 수 있습니다.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-muted rounded-lg text-left">
            <p className="font-mono text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>다시 시도</Button>
          <Link href="/ko">
            <Button variant="outline">홈으로 돌아가기</Button>
          </Link>
          <Link href="/ko/platforms/gcp">
            <Button variant="outline">GCP 가이드 보기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
