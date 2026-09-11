import React from 'react';
import { Phone, Shield, Heart, Flame, AlertTriangle, Siren } from 'lucide-react';
import { EMERGENCY_SERVICES, COMMON_SERVICES } from '../data/emergencyServices';

interface EmergencyServicesProps {
  state?: string;
}

const getIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'phone': return <Phone className="w-5 h-5" />;
    case 'shield': return <Shield className="w-5 h-5" />;
    case 'heart': return <Heart className="w-5 h-5" />;
    case 'flame': return <Flame className="w-5 h-5" />;
    case 'alert-triangle': return <AlertTriangle className="w-5 h-5" />;
    case 'siren': return <Siren className="w-5 h-5" />;
    default: return <Phone className="w-5 h-5" />;
  }
};

export const EmergencyServices: React.FC<EmergencyServicesProps> = ({ state }) => {
  const regionData = state ? EMERGENCY_SERVICES[state] : undefined;
  const services = regionData ? regionData.services : COMMON_SERVICES;
  const regionLabel = state || 'India / detected region';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
        <h2 className="text-white font-semibold text-sm flex items-center gap-2">
          <Siren className="w-4 h-4 text-red-500 animate-pulse" />
          <span>Services for {regionLabel}</span>
        </h2>
        <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono">
          PRIORITY 1
        </span>
      </div>

      <div className="p-4 border-b border-slate-800 bg-red-950/20">
        <a
          href="tel:112"
          className="flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg font-bold text-base transition-colors shadow-md active:scale-95"
        >
          <Phone className="w-5 h-5" />
          <span>Call 112 — National Emergency</span>
        </a>
      </div>

      <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto">
        {services.map((service, idx) => (
          <div key={idx} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 bg-slate-800 rounded-lg text-blue-400 shrink-0 border border-slate-700">
                {getIcon(service.icon)}
              </div>
              <div className="min-w-0">
                <h3 className="text-slate-200 text-xs font-semibold truncate">{service.name}</h3>
                <p className="text-slate-400 text-[11px] truncate mt-0.5">{service.description}</p>
              </div>
            </div>
            <a
              href={`tel:${service.number}`}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors shrink-0"
            >
              <Phone className="w-3 h-3" />
              {service.number}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
