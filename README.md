# Tracking Habits

Suivi quotidien de routines et habitudes : sport, business (cold calls), discipline, et un résumé du jour.

- **Stack** : Next.js 14 (App Router, TypeScript), Tailwind CSS, Supabase (auth + Postgres avec RLS)
- **Hébergement** : Vercel
- **Auth** : lien magique par email (Supabase Auth OTP)

## Démarrer

```bash
npm install
cp .env.example .env.local   # renseigner NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev                  # http://localhost:3000
```

## Suivi quotidien

Une entrée par jour (`daily_logs`, une ligne par utilisateur et par date) :

| Bloc | Contenu |
|---|---|
| **Sport** | Type de séance (studio renfo / course à pied / vélo / repos) + fait ou non |
| **Business** | Heures business (objectif ≥ 2h/jour) + nombre de cold calls (objectif ≥ 20/jour) |
| **Discipline** | Case « Réserve tenue aujourd'hui » — un suivi de continence, nommé discrètement |
| **Résumé** | Zone de texte libre pour le résumé de la journée |

Les 7 derniers jours sont affichés sous forme de tableau récapitulatif sur le tableau de bord.

## Base de données (Supabase)

Projet Supabase dédié, table `daily_logs` avec Row Level Security : chaque utilisateur ne voit et
ne modifie que ses propres lignes (`auth.uid() = user_id`). Contrainte d'unicité sur
`(user_id, log_date)` : un upsert par jour.

## Déploiement Vercel

1. Importer le dépôt GitHub dans Vercel
2. Framework preset : **Next.js** (détecté automatiquement)
3. Variables d'environnement (Production et Preview) : `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Dans Supabase → Authentication → URL Configuration, ajouter l'URL de production et
   `https://<domaine>/auth/callback` aux Redirect URLs

## Design

Palette sombre « encre + acide » : fond quasi noir (`#0d0e0b`), texte papier (`#f2f0e8`), accent
citron-acide (`#d9ff43`) pour les objectifs atteints et les actions, dans la continuité visuelle
des projets Alpinia Web Craft. Interface mobile-first, une seule colonne, pensée pour être remplie
en quelques secondes chaque jour.
