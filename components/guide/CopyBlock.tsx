'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CopyBlockProps {
  code: string;
  language?: string;
}

export function CopyBlock({ code, language = 'bash' }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? '복사됨!' : '복사'}
      </Button>
    </div>
  );
}
