import {
  BUSINESS_HOURS_TARGET,
  COLD_CALLS_TARGET,
  SPORT_LABELS,
  type DailyLog,
} from '@/lib/types';

function formatDay(dateIso: string) {
  return new Date(`${dateIso}T00:00:00`).toLocaleDateString('fr-CH', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function WeekOverview({ logs }: { logs: DailyLog[] }) {
  if (logs.length === 0) {
    return (
      <p className="rounded-xl2 border border-line bg-surface p-5 text-sm text-muted">
        Aucune journée enregistrée pour l&apos;instant.
      </p>
    );
  }

  const sorted = [...logs].sort((a, b) => (a.log_date < b.log_date ? 1 : -1));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="text-left text-muted">
            <th className="py-2 pr-3 font-normal">Jour</th>
            <th className="py-2 pr-3 font-normal">Sport</th>
            <th className="py-2 pr-3 font-normal">Business</th>
            <th className="py-2 pr-3 font-normal">Cold calls</th>
            <th className="py-2 pr-3 font-normal">Discipline</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((log) => (
            <tr key={log.id} className="border-t border-line">
              <td className="py-2 pr-3 text-cream">{formatDay(log.log_date)}</td>
              <td className="py-2 pr-3">
                <span className={log.sport_done ? 'text-acid' : 'text-muted'}>
                  {log.sport_done ? SPORT_LABELS[log.sport_type] : '—'}
                </span>
              </td>
              <td className="py-2 pr-3">
                <span className={log.business_hours >= BUSINESS_HOURS_TARGET ? 'text-acid' : 'text-muted'}>
                  {log.business_hours}h
                </span>
              </td>
              <td className="py-2 pr-3">
                <span className={log.cold_calls >= COLD_CALLS_TARGET ? 'text-acid' : 'text-muted'}>
                  {log.cold_calls}
                </span>
              </td>
              <td className="py-2 pr-3">
                <span className={log.reserve_held ? 'text-acid' : 'text-muted'}>
                  {log.reserve_held ? 'Tenue' : 'Rompue'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
