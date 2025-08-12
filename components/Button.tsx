
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = 'w-full font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-brand-accent text-brand-dark hover:bg-sky-400 focus:ring-brand-accent',
    secondary: 'bg-brand-secondary text-brand-text hover:bg-slate-600 focus:ring-brand-accent',
    danger: 'bg-brand-red text-white hover:bg-red-500 focus:ring-brand-red',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};