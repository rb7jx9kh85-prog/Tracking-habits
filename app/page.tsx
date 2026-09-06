import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DailyForm from '@/components/DailyForm';
import WeekOverview from '@/components/WeekOverview';
import LogoutButton from '@/components/LogoutButton';
import { todayIso, type DailyLog } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const today = todayIso();

  const { data: todayLog } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('log_date', today)
    .maybeSingle<DailyLog>();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  const weekAgoIso = weekAgo.toISOString().slice(0, 10);

  const { data: weekLogs } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('log_date', weekAgoIso)
    .order('log_date', { ascending: false })
    .returns<DailyLog[]>();

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Tracking Habits</p>
          <h1 className="mt-1 text-2xl font-semibold text-cream">Aujourd&apos;hui</h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <LogoutButton />
      </header>

      <DailyForm userId={user.id} logDate={today} initialLog={todayLog ?? null} />

      <section className="mt-12">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">
          7 derniers jours
        </h2>
        <WeekOverview logs={weekLogs ?? []} />
      </section>
    </main>
  );
}
