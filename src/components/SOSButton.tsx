import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

interface SOSButtonProps {
  onActivated: () => void;
  disabled?: boolean;
  compact?: boolean;
}

const HOLD_DURATION = 5000;

export const SOSButton: React.FC<SOSButtonProps> = ({ onActivated, disabled = false, compact = false }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cancelled, setCancelled] = useState(false);
  const activatedRef = useRef(false);
  const holdStartedAt = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, []);

  const cancelHold = () => {
    if (!isHolding || activatedRef.current) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    holdStartedAt.current = null;
    setIsHolding(false);
    setProgress(0);
    setCancelled(true);
    window.setTimeout(() => setCancelled(false), 1800);
  };

  const startHold = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || isHolding) return;
    if (event.nativeEvent.isTrusted) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    activatedRef.current = false;
    holdStartedAt.current = performance.now();
    setIsHolding(true);
    setCancelled(false);
    timerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - (holdStartedAt.current || performance.now());
      const nextProgress = Math.min(elapsed / HOLD_DURATION, 1);
      setProgress(nextProgress);
      if (nextProgress >= 1) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        activatedRef.current = true;
        setIsHolding(false);
        setProgress(0);
        onActivated();
      }
    }, 50);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled}
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerCancel={cancelHold}
        onPointerLeave={cancelHold}
        onKeyDown={(event) => {
          if ((event.key === 'Enter' || event.key === ' ') && !isHolding) {
            event.preventDefault();
            const button = event.currentTarget;
            button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
          }
        }}
        onKeyUp={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            cancelHold();
          }
        }}
        aria-label="Emergency SOS. Press and hold for 5 seconds to activate"
        className={`relative overflow-hidden rounded-xl border border-red-500/50 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-slate-950 ${compact ? 'min-h-10 px-3 py-2' : 'w-full min-h-16 px-5 py-3 text-left'}`}
      >
        {isHolding && <span className="absolute inset-y-0 left-0 bg-red-800/50 transition-[width]" style={{ width: `${progress * 100}%` }} />}
        <span className="relative flex items-center gap-3">
          <ShieldAlert className={compact ? 'w-4 h-4 shrink-0' : 'w-6 h-6 shrink-0'} />
          <span>
            <span className={`block font-bold ${compact ? 'text-xs' : 'text-base'}`}>{isHolding ? 'Keep holding to activate SOS' : 'SOS'}</span>
            <span className="block text-xs text-red-100">{isHolding ? `${Math.max(1, Math.ceil((1 - progress) * 5))} seconds remaining` : compact ? 'Emergency assistance' : 'Press and hold for 5 seconds'}</span>
          </span>
        </span>
      </button>
      {cancelled && <p role="status" className="text-xs text-amber-300">SOS cancelled. No alert was prepared.</p>}
    </div>
  );
};
