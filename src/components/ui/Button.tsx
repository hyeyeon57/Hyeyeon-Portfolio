import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-pill transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    // 에디토리얼: 블랙 배경 + 화이트 텍스트
    primary: 'bg-text-main text-white hover:opacity-90 active:opacity-80',
    secondary: 'bg-bg-soft text-text-main hover:bg-line-light active:opacity-80',
    // 아웃라인
    outline: 'border border-line-light text-text-main bg-white hover:bg-text-main hover:text-white hover:border-text-main active:opacity-90',
    ghost: 'text-text-secondary hover:bg-bg-soft hover:text-text-main active:opacity-80'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg'
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};


