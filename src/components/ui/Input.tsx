import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2.5 border rounded-lg text-text-primary placeholder-text-disabled',
          'focus:outline-none focus:ring-2 focus:ring-brand-main focus:border-transparent',
          'transition-all duration-200',
          error ? 'border-status-danger focus:ring-status-danger' : 'border-line-medium',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-status-danger">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-text-secondary">{helperText}</p>
      )}
    </div>
  );
};


