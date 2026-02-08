'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface ChecklistItem {
  text: string;
  required?: boolean;
}

interface PrerequisiteCheckProps {
  items: ChecklistItem[];
}

export function PrerequisiteCheck({ items }: PrerequisiteCheckProps) {
  const [completed, setCompleted] = useState<{ [key: number]: boolean }>({});

  if (!items || items.length === 0) return null;

  const toggleItem = (index: number) => {
    setCompleted({ ...completed, [index]: !completed[index] });
  };

  return (
    <Card className="p-6 my-6 border-primary/20">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">📋</span>
        <span>준비물 체크리스트</span>
      </h3>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={completed[index] || false}
              onChange={() => toggleItem(index)}
              className="mt-1 w-4 h-4 rounded border-gray-300"
              id={`prereq-${index}`}
            />
            <label
              htmlFor={`prereq-${index}`}
              className="flex-1 cursor-pointer select-none"
            >
              <span className={completed[index] ? 'line-through text-muted-foreground' : ''}>
                {item.text}
              </span>
              {item.required && (
                <span className="ml-2 text-xs text-red-500 font-semibold">*필수</span>
              )}
            </label>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm text-muted-foreground">
        ✓ 모든 항목을 준비하고 체크해주세요.
      </p>
    </Card>
  );
}
