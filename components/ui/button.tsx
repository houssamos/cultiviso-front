import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-full text-sm transition-all flex items-center',
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';
