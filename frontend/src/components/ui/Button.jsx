import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';
  
  const variants = {
    primary: 'bg-[#3A86FF] text-white hover:bg-[#2b6fdc] focus:ring-[#3A86FF]',
    secondary: 'bg-white text-[#1F2933] border border-[#E5E7EB] hover:bg-gray-50 hover:border-gray-300 focus:ring-[#3A86FF]',
    danger: 'bg-[#EF4444] text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'text-[#6B7280] hover:bg-gray-100 hover:text-[#1F2933] focus:ring-[#3A86FF]',
    success: 'bg-[#22C55E] text-white hover:bg-green-600 focus:ring-green-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
