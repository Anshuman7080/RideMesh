import React from 'react';

export const Spinner = ({
  size = 'md', 
  color = 'primary', 
  className = ''
}) => {
  const sizes = {
    sm: 'h-4 w-4 stroke-[3px]',
    md: 'h-8 w-8 stroke-[2px]',
    lg: 'h-12 w-12 stroke-[1.5px]'
  };

  const colors = {
    primary: 'text-primary',
    white: 'text-white',
    blue: 'text-accent-blue'
  };

  return (
    <svg
      className={`animate-spin ${sizes[size]} ${colors[color]} ${className}`}
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
  );
};

export const Skeleton = ({
  variant = 'text', 
  width = 'w-full',
  height = 'h-4',
  className = ''
}) => {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div
      className={`
        animate-pulse bg-gray-200 
        ${variants[variant]} ${width} ${height} ${className}
      `}
    />
  );
};

export const CardSkeleton = () => (
  <div className="border border-gray-100 rounded-xl p-5 bg-white space-y-3.5">
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width="w-10" height="h-10" />
      <div className="space-y-1.5 flex-1">
        <Skeleton variant="text" width="w-24" height="h-4" />
        <Skeleton variant="text" width="w-16" height="h-3" />
      </div>
    </div>
    <Skeleton variant="rectangular" width="w-full" height="h-16" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton variant="text" width="w-20" height="h-4" />
      <Skeleton variant="rectangular" width="w-16" height="h-8" />
    </div>
  </div>
);

const Loader = ({
  fullPage = false,
  message = 'Loading...',
  className = ''
}) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            {/* pulse loading rings */}
            <div className="absolute h-16 w-16 rounded-full bg-accent-blue/10 animate-ping" />
            <Spinner size="lg" color="blue" />
          </div>
          {message && (
            <p className="text-sm font-semibold text-primary-darkgray tracking-wide animate-pulse uppercase">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Spinner />
    </div>
  );
};

export default Loader;
