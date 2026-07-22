# Portfolio d'Amine Nahli

Portfolio bilingue (français/anglais), administrable et orienté recrutement. Le projet présente uniquement des informations vérifiables issues du CV officiel ou validées depuis l'administration.

## Fonctionnalités

- site public bilingue avec projets, études de cas, parcours, compétences, certifications, blog, recherche et contact ;
- interface d'administration protégée par Supabase Auth et une liste blanche en base ;
- workflow éditorial brouillon → relecture → validation → publication ;
- analyse factuelle de dépôts GitHub, sans publication automatique et sans API d'IA payante ;
- formulaire de contact stocké dans Supabase, avec protections CSRF, anti-spam et limitation de débit ;
- analytics internes optionnels, agrégés et sans cookie ni identifiant visiteur ;
- SEO technique, données structurées, sitemap, robots et images sociales ;
- en-têtes de sécurité, RLS, validation serveur et stockage privé des médias ;
- tests natifs et pgTAP, parcours Playwright, Axe WCAG 2.2 AA, budgets Lighthouse, smoke tests de production et CI GitHub Actions.

## Stack

- Next.js 15.5 (App Router), React 19 et TypeScript strict ;
- Tailwind CSS 4 ;
- Supabase Free : PostgreSQL, Auth et Storage ;
- Mermaid chargé à la demande pour les diagrammes du blog ;
- Node.js 22, Playwright, Axe, Lighthouse et Supabase CLI pour la qualité locale et la CI.

Le projet n'emploie aucune API payante, aucun essai temporaire et aucune facturation à l'usage. Les fonctionnalités externes restent désactivables et le site public fonctionne sans Supabase.

## Installation locale

Prérequis minimal : Node.js 22 et npm. Docker est requis uniquement pour valider les migrations et RLS localement.

```bash
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Ouvrir `http://localhost:3000` ; `/` redirige vers `/fr`.

## Variables d'environnement

Copier `.env.example` puis renseigner uniquement les variables nécessaires :

| Variable | Portée | Requise |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canonique | Oui en production |
| `NEXT_PUBLIC_SUPABASE_URL` | Endpoint public Supabase | Pour le contenu dynamique |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clé publique protégée par RLS | Pour le contenu dynamique |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Compatibilité temporaire | Non |
| `SUPABASE_SERVICE_ROLE_KEY` | Serveur uniquement | Admin, contact et analytics |
| `GITHUB_TOKEN` | Serveur uniquement | Non ; augmente seulement la limite GitHub |
| `CONTACT_FINGERPRINT_SECRET` | Secret HMAC d'au moins 32 octets | Contact en production |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `true` pour les compteurs agrégés | Non, défaut `false` |

Ne jamais préfixer une clé privilégiée par `NEXT_PUBLIC_`. Les valeurs réelles ne doivent jamais être commitées.

## Base de données

Appliquer les migrations de `supabase/migrations` dans l'ordre numérique à un projet Supabase Free vide ou compatible. Créer ensuite l'utilisateur Auth administrateur et ajouter son UUID dans `public.admin_users`. Toutes les tables exposées utilisent RLS ; aucun contenu n'est public avant validation bilingue. La configuration `supabase/config.toml` sert exclusivement à la pile locale et refuse les inscriptions publiques.

Le formulaire de contact et les analytics nécessitent la clé `service_role` côté serveur. Le site public conserve ses contenus factuels statiques si Supabase n'est pas configuré.

## Commandes

```bash
npm run type-check     # TypeScript strict
npm run lint           # ESLint sans avertissement
npm test               # tests unitaires et de sécurité
npm run test:coverage  # seuils de couverture
npm run build          # build de production
npm run start          # serveur de production local
npm run test:smoke     # à lancer contre le serveur démarré
npm run test:links     # vérifie les liens internes du serveur démarré
npm run test:e2e       # parcours, clavier, responsive et Axe WCAG 2.2 AA
npm run test:lighthouse # budgets Performance, A11y, Bonnes pratiques et SEO
npm run test:db        # tests pgTAP sur Supabase local démarré
npm run test:db:lint   # lint des schémas PostgreSQL locaux
npm run check          # type-check + lint + tests + build
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Sécurité](docs/SECURITY.md)
- [Tests](docs/TESTING.md)
- [Déploiement](docs/DEPLOYMENT.md)
- [Contraintes de coût nul](docs/FREE_TIER.md)
- [Contenus à compléter](docs/CONTENT_CHECKLIST.md)

Le CV public est servi depuis `CV/cv.html`, qui constitue la source officielle conservée dans le dépôt. Les anciens rapports `AUDIT.md` et `NAV_DIAGNOSIS.md` décrivent l'état antérieur à la refonte et sont archivés à titre de traçabilité.

## Licence

MIT — voir [LICENSE](LICENSE).
