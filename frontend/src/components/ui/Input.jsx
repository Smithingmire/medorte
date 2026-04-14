import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#1F2933] mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`block w-full rounded-md border border-[#E5E7EB] bg-white 
          focus:border-[#3A86FF] focus:ring-2 focus:ring-[#3A86FF]/20 
          sm:text-sm px-3 py-2 transition-colors duration-200 placeholder:text-gray-400 ${
          error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
