import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  let bgColor = '';
  let textColor = '';
  let Icon = CheckCircle;
  let label = '';

  switch (level) {
    case 'low':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      Icon = CheckCircle;
      label = 'Low Risk';
      break;
    case 'medium':
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-800';
      Icon = AlertTriangle;
      label = 'Medium Risk';
      break;
    case 'high':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      Icon = AlertCircle;
      label = 'High Risk';
      break;
  }

  return (
    <span className={`inline-flex items-center rounded-full ${bgColor} ${textColor} ${sizeClasses[size]} font-medium`}>
      <Icon className="mr-1" size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
      {label}
    </span>
  );
};