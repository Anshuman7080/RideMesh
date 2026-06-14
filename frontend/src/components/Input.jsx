import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  placeholder = '',
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-primary-darkgray mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={currentType}
          id={inputId}
          placeholder={placeholder}
          className={`
            block w-full rounded-lg text-sm transition-all duration-200 border
            ${Icon ? 'pl-11' : 'pl-4'} 
            ${isPassword ? 'pr-11' : 'pr-4'}
            py-3.5 bg-white text-primary placeholder-gray-400
            focus:outline-none focus:ring-2
            ${error 
              ? 'border-accent-red focus:ring-red-100 focus:border-accent-red' 
              : 'border-gray-200 hover:border-gray-300 focus:ring-blue-50 focus:border-accent-blue'}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-primary transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-accent-red font-medium flex items-center">
          <span className="w-1 h-1 rounded-full bg-accent-red mr-1.5 inline-block"></span>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
