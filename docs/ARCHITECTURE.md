# Architecture

## Principes

Le dépôt suit l'App Router de Next.js. Le rendu serveur reste le choix par défaut ; les composants client sont limités aux interactions (formulaires, filtres, recherche et analytics). Les accès privilégiés ne quittent jamais le serveur.

```text
src/
├── app/                    routes, layouts, métadonnées et API
│   ├── [locale]/           site public fr/en
│   ├── admin/              authentification et CMS protégé
│   └── api/                mutations serveur validées
├── components/             composants visuels par domaine
├── config/                 configuration stable du site
├── content/                contenu public factuel de repli
├── features/               logique métier testable
├── i18n/                   locales et dictionnaires
├── lib/                    intégrations et frontières serveur
└── types/                  contrats TypeScript et base
```

## Frontières

- `src/app/[locale]` orchestre le rendu et ne contient pas de logique d'accès privilégié.
- `src/features` contient la validation et les transformations indépendantes de React.
- `src/lib/supabase` sépare explicitement clients navigateur, serveur, public et admin.
- `src/lib/admin` centralise le repository éditorial et la journalisation.
- `src/app/api/admin` applique successivement session, allowlist, validation et opération.
- `src/content` garantit un portfolio utilisable sans service externe ; aucune valeur manquante n'est inventée.

## Données et publication

Supabase est la source des contenus éditoriaux publiés. Les tables parent portent un statut de publication ; les traductions FR et EN ont leur propre statut de relecture. Les gardes SQL empêchent une publication incomplète. Les politiques RLS n'exposent aux visiteurs que les contenus publiés et leurs traductions validées.

Les trois études de cas officielles restent gérées dans le code tant que le réglage public `projects.source` n'a pas la valeur JSON `"cms"`. Ce basculement explicite évite de publier une collection CMS incomplète. Après migration et validation des deux langues, créer ce réglage dans l'administration pour faire du CMS l'unique source publique des projets.

La chaîne GitHub est volontairement semi-automatique : URL officielle → faits API → inférences distinguées → corrections humaines → brouillon privé → validation → publication. Le fournisseur IA par défaut est manuel et interchangeable ; aucun contenu généré n'est publié automatiquement.

## Dégradation contrôlée

- sans Supabase : contenu factuel statique, blog vide explicite, admin et soumissions indisponibles ;
- sans token GitHub : analyse publique avec quota anonyme ;
- analytics désactivés : aucune requête de mesure et aucun impact fonctionnel ;
- notification e-mail absente : les messages restent consultables dans l'administration.

## Décisions structurantes

- un seul thème sombre cohérent pour limiter la complexité et garantir les contrastes ;
- aucun framework d'état global : l'état est local, dérivé de l'URL ou côté serveur ;
- aucun parseur Markdown tiers : sous-ensemble sûr, sans HTML brut ;
- aucune dépendance d'animation : transitions CSS et respect de `prefers-reduced-motion` ;
- aucun service d'analytics tiers : compteurs journaliers internes sans identifiant visiteur.
