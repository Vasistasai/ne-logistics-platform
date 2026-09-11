import React from 'react';
import { MessageSquare, MapPin, Clock } from 'lucide-react';
import type { IncidentReport } from '../types';
import { timeAgo } from '../utils/helpers';
import { CategoryBadge } from './CategoryBadge';
import { SeverityBadge } from './SeverityBadge';

interface CommunityFeedProps {
  incidents: IncidentReport[];
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ incidents }) => {
  const sortedIncidents = [...incidents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (sortedIncidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
        <MessageSquare className="w-12 h-12 mb-4 opacity-50 text-slate-400" />
        <p className="text-base font-medium text-slate-400">No community reports submitted yet</p>
        <p className="text-xs text-slate-500 mt-1">Be the first to report an accessibility or road incident.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {sortedIncidents.map((incident) => (
        <div 
          key={incident.id} 
          className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-200 shadow-md flex flex-col"
        >
          {/* Image */}
          <div className="w-full aspect-[16/9] relative bg-slate-950 overflow-hidden group">
            {incident.imageUrl ? (
              <img 
                src={incident.imageUrl} 
                alt={incident.category} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}
            <div className="absolute top-3 left-3 flex gap-2">
              <CategoryBadge category={incident.category} />
            </div>
            <div className="absolute top-3 right-3">
              <SeverityBadge severity={incident.severity} />
            </div>
          </div>

          {/* Details */}
          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <p className="text-slate-200 text-sm font-medium leading-relaxed">
                {incident.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 truncate max-w-[60%]">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate font-medium text-slate-300">{incident.location}, {incident.state}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0 text-slate-500 font-mono">
                <Clock className="w-3 h-3" />
                <span>{timeAgo(incident.timestamp)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
              <span className="text-emerald-400">Community Report</span>
              <span className="text-slate-500">{incident.reportedBy}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
