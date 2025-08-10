import React from 'react';
import { Bus, Train, Scaling as Walking, Zap, MapPin } from 'lucide-react';

interface TransitModeIconProps {
  mode: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const TransitModeIcon: React.FC<TransitModeIconProps> = ({ 
  mode, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getIcon = () => {
    switch (mode) {
      case 'bus':
        return <Bus className={`${sizeClasses[size]} text-blue-600 ${className}`} />;
      case 'metro':
      case 'train':
        return <Train className={`${sizeClasses[size]} text-green-600 ${className}`} />;
      case 'walk':
        return <Walking className={`${sizeClasses[size]} text-slate-600 ${className}`} />;
      case 'express':
        return <Zap className={`${sizeClasses[size]} text-purple-600 ${className}`} />;
      default:
        return <MapPin className={`${sizeClasses[size]} text-slate-400 ${className}`} />;
    }
  };

  return getIcon();
};

export default TransitModeIcon;