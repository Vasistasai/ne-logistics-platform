import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle, MapPin } from 'lucide-react';
import type { UserLocation, IncidentReport, IncidentCategory } from '../types';
import { generateId } from '../utils/helpers';
import { NE_STATES } from '../data/states';

interface IncidentReportFormProps {
  userLocation: UserLocation;
  onSubmit: (report: IncidentReport) => void;
}

export const IncidentReportForm: React.FC<IncidentReportFormProps> = ({ userLocation, onSubmit }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState<IncidentCategory>('Landslide');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [description, setDescription] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [state, setState] = useState(userLocation.state || 'Assam');
  const [status, setStatus] = useState<'empty' | 'image-selected' | 'submitting' | 'submitted'>('empty');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setStatus('image-selected');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setStatus('empty');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setStatus('submitting');

    setTimeout(() => {
      const selectedStateObj = NE_STATES.find(s => s.name === state);
      const coords = userLocation.coordinates || (selectedStateObj ? selectedStateObj.center : { lat: 26.2006, lng: 92.9376 });

      const newReport: IncidentReport = {
        id: generateId(),
        category,
        severity,
        description,
        location: manualLocation || (userLocation.city ? `${userLocation.city} Area` : 'Regional Road Segment'),
        state,
        coordinates: coords,
        imageUrl: imagePreview || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=60',
        timestamp: new Date().toISOString(),
        reportedBy: 'Community Reporter'
      };

      onSubmit(newReport);
      setStatus('submitted');

      setTimeout(() => {
        setDescription('');
        setManualLocation('');
        setImagePreview(null);
        setStatus('empty');
      }, 2500);
    }, 600);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-slate-100 font-bold text-base flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-blue-400" />
          <span>Report an Incident / Blockade</span>
        </h3>
        <p className="text-slate-400 text-xs mt-1">
          Upload photo & details to update live regional map and emergency rerouting index.
        </p>
      </div>

      {status === 'submitted' ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
          <CheckCircle className="w-12 h-12 text-emerald-400 animate-bounce" />
          <h4 className="text-emerald-300 font-bold text-lg">Report Submitted Successfully</h4>
          <p className="text-xs text-slate-400 max-w-xs">
            Incident added to local feed & interactive map marker pinned.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Photo Upload Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Photograph / Evidence (Required)
            </label>
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 max-h-48 group">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-slate-900/80 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-950/50 hover:bg-slate-800/40 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center group"
              >
                <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors mb-2" />
                <p className="text-xs font-semibold text-slate-300">Click to upload photo</p>
                <p className="text-[11px] text-slate-500 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </div>
            )}
          </div>

          {/* Category & Severity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Incident Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Flood">Flood</option>
                <option value="Landslide">Landslide</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Infrastructure Damage">Infrastructure Damage</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as 'low' | 'medium' | 'high' | 'critical')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* State & Location Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {NE_STATES.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location Details
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={userLocation.city ? `Near ${userLocation.city}` : "e.g. Highway KM 42, Chumukedima"}
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pl-8 text-xs text-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Incident Description
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe road blockage, river overflow, collapsed culvert, or infrastructure issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-600 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {status === 'submitting' ? (
              <span>Submitting Incident...</span>
            ) : (
              <span>Submit Community Report</span>
            )}
          </button>

        </form>
      )}
    </div>
  );
};
