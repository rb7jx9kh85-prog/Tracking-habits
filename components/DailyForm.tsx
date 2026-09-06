'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  BUSINESS_HOURS_TARGET,
  COLD_CALLS_TARGET,
  SPORT_LABELS,
  type DailyLog,
  type SportType,
} from '@/lib/types';

const SPORT_OPTIONS: SportType[] = ['renfo', 'course', 'velo', 'repos'];

export default function DailyForm({
  userId,
  logDate,
  initialLog,
}: {
  userId: string;
  logDate: string;
  initialLog: DailyLog | null;
}) {
  const [sportType, setSportType] = useState<SportType>(initialLog?.sport_type ?? 'repos');
  const [sportDone, setSportDone] = useState(initialLog?.sport_done ?? false);
  const [businessHours, setBusinessHours] = useState(initialLog?.business_hours ?? 0);
  const [coldCalls, setColdCalls] = useState(initialLog?.cold_calls ?? 0);
  const [reserveHeld, setReserveHeld] = useState(initialLog?.reserve_held ?? true);
  const [summary, setSummary] = useState(initialLog?.summary ?? '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function save() {
    setSaved(false);
    setError('');
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.from('daily_logs').upsert(
        {
          user_id: userId,
          log_date: logDate,
          sport_type: sportType,
          sport_done: sportDone,
          business_hours: businessHours,
          cold_calls: coldCalls,
          reserve_held: reserveHeld,
          summary,
        },
        { onConflict: 'user_id,log_date' }
      );

      if (error) {
        setError(error.message);
        return;
      }
      setSaved(true);
    });
  }

  const businessOk = businessHours >= BUSINESS_HOURS_TARGET;
  const callsOk = coldCalls >= COLD_CALLS_TARGET;

  return (
    <div className="space-y-6">
      {/* Sport */}
      <section className="rounded-xl2 border border-line bg-surface p-5">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">Sport</h2>
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SPORT_OPTIONS.map((option) => (
            <label
              key={option}
              className={`cursor-pointer rounded-xl2 border px-3 py-2 text-center text-sm transition ${
                sportType === option
                  ? 'border-acid bg-acid/10 text-acid'
                  : 'border-line text-cream hover:border-muted'
              }`}
            >
              <input
                type="radio"
                name="sport"
                value={option}
                checked={sportType === option}
                onChange={() => setSportType(option)}
                className="hidden"
              />
              {SPORT_LABELS[option]}
            </label>
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-cream">
          <input
            type="checkbox"
            checked={sportDone}
            onChange={(e) => setSportDone(e.target.checked)}
            className="h-5 w-5 rounded border-line bg-ink"
          />
          Séance faite aujourd&apos;hui
        </label>
      </section>

      {/* Business */}
      <section className="rounded-xl2 border border-line bg-surface p-5">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">Business</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center justify-between text-sm text-cream">
              <span>Heures business</span>
              <span className={businessOk ? 'text-acid' : 'text-muted'}>
                min. {BUSINESS_HOURS_TARGET}h
              </span>
            </label>
            <input
              type="number"
              min={0}
              max={16}
              step={0.25}
              value={businessHours}
              onChange={(e) => setBusinessHours(Number(e.target.value))}
              className="w-full rounded-xl2 border border-line bg-ink px-4 py-3 text-cream outline-none focus:border-acid"
            />
          </div>
          <div>
            <label className="mb-2 flex items-center justify-between text-sm text-cream">
              <span>Cold calls</span>
              <span className={callsOk ? 'text-acid' : 'text-muted'}>
                min. {COLD_CALLS_TARGET}
              </span>
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={coldCalls}
              onChange={(e) => setColdCalls(Number(e.target.value))}
              className="w-full rounded-xl2 border border-line bg-ink px-4 py-3 text-cream outline-none focus:border-acid"
            />
          </div>
        </div>
      </section>

      {/* Discipline */}
      <section className="rounded-xl2 border border-line bg-surface p-5">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">Discipline</h2>
        <label className="flex items-center gap-3 text-sm text-cream">
          <input
            type="checkbox"
            checked={reserveHeld}
            onChange={(e) => setReserveHeld(e.target.checked)}
            className="h-5 w-5 rounded border-line bg-ink"
          />
          Réserve tenue aujourd&apos;hui
        </label>
      </section>

      {/* Résumé */}
      <section className="rounded-xl2 border border-line bg-surface p-5">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">
          Résumé du jour
        </h2>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          placeholder="Ce qui a marché, ce qui a coincé, la prochaine action…"
          className="w-full resize-none rounded-xl2 border border-line bg-ink px-4 py-3 text-cream outline-none focus:border-acid"
        />
      </section>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={isPending}
          className="rounded-xl2 bg-acid px-6 py-3 font-medium text-ink transition hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? 'Enregistrement…' : 'Enregistrer la journée'}
        </button>
        {saved && !isPending && <span className="text-sm text-signal">Enregistré ✓</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    </div>
  );
}
