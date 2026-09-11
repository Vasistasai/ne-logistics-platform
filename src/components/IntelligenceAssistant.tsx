import React, { useState } from 'react';
import { Bot, MapPin, Send, ShieldAlert } from 'lucide-react';
import type { IntelligenceItem } from '../types';
import { createLocalEvidenceSummary, type LocalEvidenceResult } from '../services/assistantService';
import { formatFreshness } from '../services/intelligenceService';

interface IntelligenceAssistantProps {
  items: IntelligenceItem[];
  currentRegion?: string;
  onViewItem: (item: IntelligenceItem) => void;
}

const EXAMPLE_QUESTIONS = [
  'Are there any major road disruptions in Assam?',
  'What areas currently have the highest logistics risk?',
  'Summarize the latest Northeast alerts.',
  'What incidents are near my location?'
];

export const IntelligenceAssistant: React.FC<IntelligenceAssistantProps> = ({ items, currentRegion, onViewItem }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<LocalEvidenceResult | null>(null);

  const askQuestion = (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;
    setQuery(trimmedQuestion);
    setResult(createLocalEvidenceSummary(trimmedQuestion, items, currentRegion));
  };

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 border-b border-slate-800 bg-cyan-500/[0.04]">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Bot className="w-5 h-5" /></div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">NER Intelligence Assistant</h3>
            <p className="text-xs text-slate-400 mt-1">Ask about routes, hazards, accessibility and logistics.</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> AI assistant not configured
        </div>
      </div>

      <div className="p-4 space-y-4">
        <form onSubmit={(event) => { event.preventDefault(); askQuestion(query); }} className="flex gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask about current intelligence..."
            className="min-w-0 flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
          <button type="submit" aria-label="Ask intelligence question" className="w-9 h-9 shrink-0 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </form>

        {!result && (
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Example questions</p>
            {EXAMPLE_QUESTIONS.map((question) => (
              <button key={question} onClick={() => askQuestion(question)} className="w-full text-left text-xs text-slate-300 hover:text-cyan-300 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-lg px-3 py-2 transition-colors">
                {question}
              </button>
            ))}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-2"><ShieldAlert className="w-3.5 h-3.5" /> Local evidence summary</div>
              <p className="text-xs text-slate-300 leading-relaxed">{result.summary}</p>
            </div>
            {result.matchedItems.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                  <span className="text-[9px] font-mono text-slate-500 uppercase whitespace-nowrap">{item.status}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500">
                  <span>{item.location} · {formatFreshness(item.timestamp)}</span>
                  <button onClick={() => onViewItem(item)} className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 whitespace-nowrap"><MapPin className="w-3 h-3" /> View on map</button>
                </div>
              </div>
            ))}
            <button onClick={() => setResult(null)} className="text-[11px] text-slate-500 hover:text-slate-300">Show example questions</button>
          </div>
        )}
      </div>
    </div>
  );
};
