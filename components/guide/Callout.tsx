import type { ReactNode } from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'danger' | 'tip';
  children: ReactNode;
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100',
    danger: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
    tip: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100',
  };

  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    danger: '❌',
    tip: '💡',
  };

  return (
    <div className={`border-l-4 p-4 my-4 ${styles[type]}`}>
      <div className="flex gap-2">
        <span className="text-lg">{icons[type]}</span>
        <div>{children}</div>
      </div>
    </div>
  );
}
