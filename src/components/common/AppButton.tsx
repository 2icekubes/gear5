import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  children: ReactNode;
}

export function AppButton({ variant = 'primary', className = '', children, ...props }: AppButtonProps) {
  return (
    <button className={`app-button app-button--${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
