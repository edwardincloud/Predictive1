import React from 'react';

interface TabProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ isActive, onClick, children }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};