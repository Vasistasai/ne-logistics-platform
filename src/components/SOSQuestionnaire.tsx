import React from 'react';
import type { SOSEvent, SOSHelpType, SOSResponse, SOSSituation } from '../types';

interface SOSQuestionnaireProps {
  event: SOSEvent;
  onChange: (event: SOSEvent) => void;
}

const responseOptions: { value: SOSResponse; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not-sure', label: 'Not sure' }
];

const helpOptions: SOSHelpType[] = ['Medical', 'Police', 'Fire / Rescue', 'Road assistance', 'General emergency', 'Not sure'];
const situationOptions: SOSSituation[] = ['Accident', 'Medical emergency', 'Road blockage', 'Fire', 'Flood', 'Landslide', 'Unsafe situation', 'Other'];

export const SOSQuestionnaire: React.FC<SOSQuestionnaireProps> = ({ event, onChange }) => {
  const update = (patch: Partial<SOSEvent>) => onChange({ ...event, ...patch });
  const toggleHelp = (helpType: SOSHelpType) => {
    const helpTypes = event.helpTypes.includes(helpType)
      ? event.helpTypes.filter((item) => item !== helpType)
      : [...event.helpTypes, helpType];
    update({ helpTypes });
  };

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="text-sm font-semibold text-slate-100 mb-2">Are you injured?</legend>
        <div className="grid grid-cols-3 gap-2">
          {responseOptions.map((option) => <button key={option.value} type="button" onClick={() => update({ injured: option.value })} className={`rounded-lg border px-2 py-2 text-xs font-semibold ${event.injured === option.value ? 'border-red-400 bg-red-500/15 text-red-200' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'}`}>{option.label}</button>)}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-100 mb-2">Do you need immediate medical assistance?</legend>
        <div className="grid grid-cols-3 gap-2">
          {responseOptions.map((option) => <button key={option.value} type="button" onClick={() => update({ medicalAssistanceRequired: option.value })} className={`rounded-lg border px-2 py-2 text-xs font-semibold ${event.medicalAssistanceRequired === option.value ? 'border-red-400 bg-red-500/15 text-red-200' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'}`}>{option.label}</button>)}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-100 mb-2">What kind of help do you need?</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {helpOptions.map((helpType) => <button key={helpType} type="button" onClick={() => toggleHelp(helpType)} className={`rounded-lg border px-2 py-2 text-xs font-semibold text-left ${event.helpTypes.includes(helpType) ? 'border-red-400 bg-red-500/15 text-red-200' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'}`}>{helpType}</button>)}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-100 mb-2">What happened? <span className="text-slate-500 font-normal">Optional</span></legend>
        <select value={event.emergencyType || ''} onChange={(e) => update({ emergencyType: e.target.value as SOSSituation || undefined })} className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200">
          <option value="">Select situation</option>
          {situationOptions.map((situation) => <option key={situation}>{situation}</option>)}
        </select>
      </fieldset>

      <label className="block text-sm font-semibold text-slate-100">Add a short description <span className="text-slate-500 font-normal">Optional</span>
        <textarea value={event.description} onChange={(e) => update({ description: e.target.value })} rows={3} maxLength={500} placeholder="Share only what is useful to emergency responders." className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-normal text-slate-200 placeholder:text-slate-600 resize-none" />
      </label>
    </div>
  );
};
