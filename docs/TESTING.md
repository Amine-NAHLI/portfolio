# Stratégie de test

## Pyramide actuelle

- tests natifs Node : validation du contact, références GitHub, schémas admin et invariants SQL/RLS ;
- tests PostgreSQL pgTAP : migrations réelles, privilèges, stockage privé et lecture publique RLS ;
- analyse statique : TypeScript strict et ESLint sans avertissement ;
- build Next.js : compilation serveur/client, génération statique et métadonnées ;
- smoke tests : routes FR/EN, redirections, en-têtes, garde admin, CSRF et CV sur le serveur de production ;
- Playwright + Axe : parcours critiques, clavier, langue, sept viewports et WCAG 2.2 AA automatisé ;
- Lighthouse : budgets bloquants sur les routes publiques principales, sans service distant.

## Exécution locale

```bash
npm run type-check
npm run lint
npm run test:coverage
npm run build
npm run start
npm run test:smoke
npm run test:links
npm run test:e2e
npm run test:lighthouse
npx supabase start --exclude edge-runtime,gotrue,imgproxy,kong,logflare,mailpit,postgres-meta,postgrest,realtime,storage-api,studio,supavisor,vector
npm run test:db
npm run test:db:lint
npx supabase stop
```

Les seuils automatiques sont de 80 % des lignes et fonctions et 75 % des branches pour les modules couverts. La CI exécute la même chaîne sur Node.js 22.

## Recette manuelle obligatoire

À 320, 375, 768, 1024, 1440 et 1920 px :

- navigation, changement de langue, recherche, filtres, liens externes et absence de débordement horizontal ;
- clavier uniquement : skip link, ordre de tabulation, focus visible, menus, formulaires et administration ;
- lecteur d'écran : titres, régions, erreurs, statuts et libellés ;
- zoom 200 % et reflow à 320 CSS px ;
- `prefers-reduced-motion`, contraste normal/états interactifs et cibles tactiles ;
- parcours contact valide/invalide/limité, connexion autorisée/refusée, CRUD et publication bilingue ;
- RLS avec les trois rôles documentés dans `SECURITY.md`.

## Contrôles navigateur

Exécuter Lighthouse en navigation privée sur `/fr`, `/en`, `/fr/projects` et un article publié. Cibles : Accessibilité et SEO ≥ 95, Bonnes pratiques ≥ 95, Performance mobile ≥ 90, aucun échec Core Web Vitals sur une mesure représentative.

Les tests E2E, responsive et d'accessibilité sont automatisés. La recette manuelle lecteur d'écran, zoom 200 %, qualité du contenu et validation sur appareils réels reste bloquante avant la première mise en production.
