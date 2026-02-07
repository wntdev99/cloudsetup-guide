'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Prerequisite {
  slug: string;
  title: string;
}

interface PrerequisiteCheckProps {
  prerequisites: Prerequisite[];
  locale: 'ko' | 'en';
}

export function PrerequisiteCheck({ prerequisites, locale }: PrerequisiteCheckProps) {
  const [completed, setCompleted] = useState<{ [key: string]: boolean }>({});
  const [showWarning, setShowWarning] = useState(true);

  if (prerequisites.length === 0) return null;

  const allCompleted = prerequisites.every((p) => completed[p.slug]);

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">
        {locale === 'ko' ? '선행 가이드' : 'Prerequisites'}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {locale === 'ko'
          ? '이 가이드를 시작하기 전에 다음 가이드를 먼저 완료하는 것을 권장합니다:'
          : 'We recommend completing the following guides before starting this one:'}
      </p>

      <ul className="space-y-3">
        {prerequisites.map((prereq) => (
          <li key={prereq.slug} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={completed[prereq.slug] || false}
              onChange={(e) => setCompleted({ ...completed, [prereq.slug]: e.target.checked })}
              className="w-4 h-4"
            />
            <Link
              href={`/${locale}/guides/${prereq.slug}`}
              className="text-primary hover:underline"
            >
              {prereq.title}
            </Link>
          </li>
        ))}
      </ul>

      {!allCompleted && showWarning && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-900 dark:text-yellow-100">
            {locale === 'ko'
              ? '⚠️ 선행 가이드를 완료하지 않으면 일부 내용을 이해하기 어려울 수 있습니다.'
              : '⚠️ Without completing prerequisites, some content may be difficult to understand.'}
          </p>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowWarning(false)}
            className="mt-2 h-auto py-1 px-2 text-xs"
          >
            {locale === 'ko' ? '이해했습니다' : 'I understand'}
          </Button>
        </div>
      )}
    </Card>
  );
}
