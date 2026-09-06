export type SportType = 'renfo' | 'course' | 'velo' | 'repos';

export interface DailyLog {
  id: string;
  user_id: string;
  log_date: string;
  sport_type: SportType;
  sport_done: boolean;
  business_hours: number;
  cold_calls: number;
  reserve_held: boolean;
  summary: string;
  created_at: string;
  updated_at: string;
}

export const SPORT_LABELS: Record<SportType, string> = {
  renfo: 'Studio — renfo',
  course: 'Course à pied',
  velo: 'Vélo',
  repos: 'Repos',
};

export const BUSINESS_HOURS_TARGET = 2;
export const COLD_CALLS_TARGET = 20;

export function todayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}
