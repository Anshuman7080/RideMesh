import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:scale-100';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light focus:ring-primary-light',
    secondary: 'bg-primary-gray text-primary hover:bg-gray-200 focus:ring-gray-300',
    outline: 'border border-gray-300 bg-transparent text-primary hover:bg-gray-50 focus:ring-gray-200',
    danger: 'bg-accent-red text-white hover:bg-red-700 focus:ring-accent-red',
    ghost: 'bg-transparent text-primary hover:bg-gray-100 focus:ring-gray-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <span className="mr-2 inline-flex items-center"><Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} /></span>
      )}
      
      <span>{children}</span>
      
      {!loading && Icon && iconPosition === 'right' && (
        <span className="ml-2 inline-flex items-center"><Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} /></span>
      )}
    </button>
  );
};

export default Button;
