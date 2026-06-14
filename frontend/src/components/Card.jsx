import React from 'react';

const Card = ({
  children,
  onClick,
  hoverable = false,
  className = '',
  padding = 'normal', 
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    compact: 'p-3',
    normal: 'p-5',
    spacious: 'p-8',
  };

  const isClickable = !!onClick;
  const cursorStyle = isClickable ? 'cursor-pointer' : '';
  const hoverStyles = (hoverable || isClickable) 
    ? 'hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-gray-100 rounded-xl shadow-sm transition-all duration-300
        ${paddings[padding]} ${cursorStyle} ${hoverStyles} ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
