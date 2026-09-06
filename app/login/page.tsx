'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const linkFailed = searchParams.get('error') === 'lien_invalide';

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
      return;
    }

    setStatus('sent');
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted">Tracking Habits</p>
        <h1 className="mb-8 text-2xl font-semibold text-cream">Connexion</h1>

        {linkFailed && status !== 'sent' && (
          <p className="mb-4 rounded-xl2 border border-line bg-surface p-4 text-sm text-red-400">
            Le lien de connexion a expiré ou a déjà été utilisé. Redemande-en un ci-dessous.
          </p>
        )}

        {status === 'sent' ? (
          <p className="rounded-xl2 border border-line bg-surface p-5 text-sm text-cream">
            Lien de connexion envoyé à <span className="text-acid">{email}</span>. Ouvre ta boîte
            mail pour continuer.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-muted">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.ch"
                className="w-full rounded-xl2 border border-line bg-surface px-4 py-3 text-cream outline-none focus:border-acid"
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-400">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-xl2 bg-acid px-4 py-3 font-medium text-ink transition hover:opacity-90 disabled:opacity-50"
            >
              {status === 'sending' ? 'Envoi…' : 'Recevoir le lien magique'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
