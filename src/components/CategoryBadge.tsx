import React from 'react';
import { Droplets, Mountain, Construction, Building, AlertCircle } from 'lucide-react';

interface CategoryBadgeProps {
  category: string;
}

const categoryConfig: Record<string, { color: string; bg: string; icon: React.FC<any> }> = {
  'Flood': { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Droplets },
  'Landslide': { color: 'text-orange-500', bg: 'bg-orange-500/10', icon: Mountain },
  'Road Damage': { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Construction },
  'Infrastructure Damage': { color: 'text-red-500', bg: 'bg-red-500/10', icon: Building },
  'Other': { color: 'text-gray-400', bg: 'bg-gray-400/10', icon: AlertCircle },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const config = categoryConfig[category] || categoryConfig['Other'];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {category}
    </span>
  );
};
