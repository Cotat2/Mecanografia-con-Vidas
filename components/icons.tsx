import React from 'react';

interface IconProps {
  filled: boolean;
  className?: string;
}

export const HeartIcon: React.FC<IconProps> = ({ filled, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-8 h-8 transition-colors duration-300 ${className}`}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? 'none' : 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    color={filled ? '#ef4444' : '#475569'}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
