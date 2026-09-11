import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, MapPin, Phone, ShieldAlert, X } from 'lucide-react';
import type { EmergencyContact, SOSEvent, SOSHelpType, SOSResponse, SOSSituation, UserLocation } from '../types';
import { createSOSEvent, findNearestConfiguredService, getEmergencyContact, prepareEmergencyMessage, saveEmergencyContact, sendEmergencyAlert } from '../services/sosService';
import { SOSButton } from './SOSButton';

interface SOSWorkflowProps {
  location: UserLocation;
  currentRegion?: string;
  onRequestLocation: () => void;
  onClose: () => void;
  inline?: boolean;
  startActive?: boolean;
}

const responseOptions: SOSResponse[] = ['yes', 'no', 'not-sure'];
const helpOptions: SOSHelpType[] = ['Medical', 'Police', 'Fire / Rescue', 'Road assistance', 'General emergency', 'Not sure'];
const situationOptions: SOSSituation[] = ['Accident', 'Medical emergency', 'Road blockage', 'Fire', 'Flood', 'Landslide', 'Unsafe situation', 'Other'];

const formatResponse = (value?: SOSResponse) => value === 'not-sure' ? 'Not sure' : value ? value[0].toUpperCase() + value.slice(1) : 'Not answered';

export const SOSWorkflow: React.FC<SOSWorkflowProps> = ({ location, currentRegion, onRequestLocation, onClose, inline = false, startActive = false }) => {
  const [event, setEvent] = useState<SOSEvent | null>(() => startActive ? createSOSEvent() : null);
  const [contact, setContact] = useState<EmergencyContact>(() => getEmergencyContact() || { name: '', number: '' });
  const [showContact, setShowContact] = useState(false);
  const [cancelRequested, setCancelRequested] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!event || location.status === 'requesting' || location.status === 'detected') return;
    if (location.status === 'idle' || location.status === 'denied') onRequestLocation();
  }, [event, location.status, onRequestLocation]);

  const locationLabel = location.status === 'detected' || location.status === 'manual'
    ? `Near ${location.city ? `${location.city}, ` : ''}${location.state || currentRegion || 'known region'}`
    : undefined;

  const nearestService = useMemo(() => {
    if (!event) return undefined;
    return findNearestConfiguredService(event.helpTypes, location.state || currentRegion);
  }, [event, location.state, currentRegion]);

  const activate = () => {
    setEvent(createSOSEvent());
    setCancelRequested(false);
    setMessage('');
  };

  const updateEvent = (changes: Partial<SOSEvent>) => setEvent((current) => current ? { ...current, ...changes } : current);

  const toggleHelpType = (helpType: SOSHelpType) => {
    const next = event?.helpTypes.includes(helpType)
      ? event.helpTypes.filter((item) => item !== helpType)
      : [...(event?.helpTypes || []), helpType];
    updateEvent({ helpTypes: next });
  };

  const prepareAlert = async () => {
    if (!event || isPreparing) return;
    setIsPreparing(true);
    const nextEvent = {
      ...event,
      location: location.coordinates,
      locationAccuracy: location.accuracy,
      locationLabel,
      nearestService,
      notificationStatus: 'not-sent' as const
    };
    const result = await sendEmergencyAlert({ event: nextEvent, emergencyContact: contact.name && contact.number ? contact : undefined });
    setMessage(result.message);
    setEvent({ ...nextEvent, status: 'completed', notificationStatus: result.status, notificationProvider: result.provider });
    setIsPreparing(false);
  };

  const cancel = () => {
    if (event) setEvent({ ...event, status: 'cancelled' });
  };

  if (!inline && !event) {
    return (
      <div className="fixed inset-0 z-[1200] bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-slate-950 border border-red-500/40 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div><p className="text-xs text-red-400 font-mono uppercase tracking-wider">Emergency Assistance</p><h2 className="text-xl font-bold text-slate-100">SOS request</h2></div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white" aria-label="Close SOS"><X className="w-5 h-5" /></button>
          </div>
          <p className="text-sm text-slate-400 mb-4">Press and hold the button for five seconds. A normal click will not activate SOS.</p>
          <SOSButton onActivated={activate} />
        </div>
      </div>
    );
  }

  if (!event) return <SOSButton onActivated={activate} />;

  return (
    <div className={inline ? 'bg-slate-950 border border-red-500/40 rounded-xl p-4 sm:p-5 space-y-5' : 'fixed inset-0 z-[1200] bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto'}>
      <div className={!inline ? 'max-w-2xl mx-auto bg-slate-950 border border-red-500/40 rounded-2xl p-5 space-y-5' : 'space-y-5'}>
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs text-red-400 font-mono uppercase tracking-wider">SOS Active</p><h2 className="text-xl font-bold text-slate-100">Emergency assistance requested</h2><p className="text-xs text-slate-400 mt-1">This is a demo notification workflow. Emergency services have not been contacted.</p></div>
          {!inline && <button onClick={onClose} className="p-2 text-slate-400 hover:text-white" aria-label="Close SOS"><X className="w-5 h-5" /></button>}
        </div>

        {event.status === 'cancelled' ? (
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-300">SOS cancelled. No emergency notification was prepared.<button onClick={onClose} className="block mt-3 text-cyan-400 hover:text-cyan-300 text-xs">Return to application</button></div>
        ) : event.status === 'completed' ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/30"><div className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" /><div><h3 className="text-sm font-semibold text-amber-300">Demo notification prepared</h3><p className="text-xs text-slate-400 mt-1">{message}</p></div></div></div>
            <div className="grid sm:grid-cols-3 gap-2 text-xs"><Status label="Location" value={event.locationLabel || 'Unavailable'} /><Status label="Assistance" value={nearestService?.name || 'Unavailable'} /><Status label="Delivery" value="Not sent" /></div>
            <pre className="whitespace-pre-wrap bg-slate-900 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-300 font-sans">{prepareEmergencyMessage(event)}</pre>
            <button onClick={onClose} className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 text-sm font-semibold">Return to application</button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <Question title="Are you injured?" value={event.injured} onChange={(value) => updateEvent({ injured: value })} />
              <Question title="Do you need immediate medical assistance?" value={event.medicalAssistanceRequired} onChange={(value) => updateEvent({ medicalAssistanceRequired: value })} />
            </div>

            <fieldset><legend className="text-sm font-semibold text-slate-200 mb-2">What kind of help do you need?</legend><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{helpOptions.map((help) => <label key={help} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs ${event.helpTypes.includes(help) ? 'border-red-400 bg-red-500/10 text-red-200' : 'border-slate-800 bg-slate-900 text-slate-400'}`}><input type="checkbox" checked={event.helpTypes.includes(help)} onChange={() => toggleHelpType(help)} className="sr-only" />{help}</label>)}</div></fieldset>

            <div><label className="block text-sm font-semibold text-slate-200 mb-2" htmlFor="sos-situation">What happened?</label><select id="sos-situation" value={event.emergencyType || ''} onChange={(e) => updateEvent({ emergencyType: e.target.value as SOSSituation })} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200"><option value="">Select if known</option>{situationOptions.map((situation) => <option key={situation}>{situation}</option>)}</select></div>
            <div><label className="block text-sm font-semibold text-slate-200 mb-2" htmlFor="sos-description">Add a short description <span className="text-slate-500 font-normal">(optional)</span></label><textarea id="sos-description" value={event.description} onChange={(e) => updateEvent({ description: e.target.value })} rows={3} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 resize-none" placeholder="What should responders know?" /></div>

              <div className="rounded-lg border border-slate-800 bg-slate-900 p-3"><div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-cyan-400 shrink-0" /><div><h3 className="text-sm font-semibold text-slate-200">{location.status === 'detected' || location.status === 'manual' ? 'Location detected' : location.status === 'requesting' ? 'Requesting location' : 'Location unavailable'}</h3><p className="text-xs text-slate-400 mt-1">Your location is used to identify configured emergency assistance and include your position in the alert.</p><p className="text-xs text-slate-300 mt-2">{locationLabel || 'Select a region or allow browser location access.'}</p>{location.status === 'denied' && <button onClick={onRequestLocation} className="mt-2 text-xs text-cyan-400 hover:text-cyan-300">Try location again</button>}</div></div></div>

            {nearestService && <div className="rounded-lg border border-slate-800 bg-slate-900 p-3"><h3 className="text-sm font-semibold text-slate-200">Nearest configured assistance</h3><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2"><div><p className="text-xs text-slate-300">{nearestService.name}</p><p className="text-[11px] text-slate-500">{nearestService.description} · {nearestService.source}</p></div><a href={`tel:${nearestService.number}`} className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs text-cyan-300"><Phone className="w-3.5 h-3.5" />{nearestService.number}</a></div><p className="text-[10px] text-amber-400 mt-2">Distance and availability: Unavailable</p></div>}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-800 pt-4"><button onClick={() => setCancelRequested(true)} className="text-sm text-red-400 hover:text-red-300 text-left">Cancel emergency</button><button onClick={prepareAlert} disabled={isPreparing} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 px-4 py-2.5 text-sm font-semibold text-white"><ShieldAlert className="w-4 h-4" />{isPreparing ? 'Preparing alert...' : 'Prepare emergency alert'}</button></div>
            {showContact ? <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 space-y-2"><p className="text-xs font-semibold text-slate-200">Optional emergency contact</p><input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Contact name" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200" /><input value={contact.number} onChange={(e) => setContact({ ...contact, number: e.target.value })} placeholder="Contact number" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200" /><button onClick={() => { saveEmergencyContact(contact); setShowContact(false); }} className="text-xs text-cyan-400">Save contact locally</button></div> : <button onClick={() => setShowContact(true)} className="text-xs text-slate-500 hover:text-slate-300">Configure optional emergency contact</button>}
          </>
        )}

        {cancelRequested && event.status === 'active' && <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><p className="text-xs text-red-200">Are you sure you want to cancel the SOS request?</p><div className="flex gap-2"><button onClick={() => setCancelRequested(false)} className="text-xs text-slate-300 px-2 py-1">Keep SOS active</button><button onClick={cancel} className="text-xs rounded bg-red-600 px-2 py-1 text-white">Cancel SOS</button></div></div>}
      </div>
    </div>
  );
};

const Question = ({ title, value, onChange }: { title: string; value?: SOSResponse; onChange: (value: SOSResponse) => void }) => <fieldset><legend className="text-sm font-semibold text-slate-200 mb-2">{title}</legend><div className="flex gap-2">{responseOptions.map((option) => <button key={option} type="button" onClick={() => onChange(option)} className={`flex-1 rounded-lg border px-2 py-2 text-xs capitalize ${value === option ? 'border-red-400 bg-red-500/10 text-red-200' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>{formatResponse(option)}</button>)}</div></fieldset>;
const Status = ({ label, value }: { label: string; value: string }) => <div className="rounded-lg border border-slate-800 bg-slate-900 p-3"><p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p><p className="text-xs text-slate-200 mt-1">{value}</p></div>;
