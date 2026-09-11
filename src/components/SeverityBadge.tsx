import React from 'react';

interface SeverityBadgeProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const severityConfig = {
  low: { color: 'bg-green-500', text: 'text-green-500', bg: 'bg-green-500/10' },
  medium: { color: 'bg-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  high: { color: 'bg-orange-500', text: 'text-orange-500', bg: 'bg-orange-500/10' },
  critical: { color: 'bg-red-500', text: 'text-red-500', bg: 'bg-red-500/10' },
};

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const config = severityConfig[severity];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
      <span className="capitalize">{severity}</span>
    </span>
  );
};
