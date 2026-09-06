// L'URL et la clé publishable Supabase sont conçues pour être publiques
// (protégées par Row Level Security côté base). Les valeurs par défaut ici
// pointent vers le projet dédié à cette app ; NEXT_PUBLIC_SUPABASE_URL /
// NEXT_PUBLIC_SUPABASE_ANON_KEY dans Vercel prennent le dessus si définies.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://kkuvsteecdvhsgiwutca.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_7Z8hb3ln2t5dEuymqwuw4w_bmYVCasF';
