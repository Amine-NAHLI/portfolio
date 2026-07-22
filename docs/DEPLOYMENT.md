# Déploiement à coût nul

## Préproduction

1. créer un projet Supabase dans une organisation **Free**, sans carte bancaire et sans essai ;
2. appliquer `supabase/migrations/001...005` dans l'ordre et vérifier leur réussite ;
3. créer un unique utilisateur Auth, puis insérer son UUID dans `public.admin_users` avec `active = true` ;
4. vérifier les politiques RLS selon `SECURITY.md` et importer seulement du contenu réel ;
   pour basculer les projets vers le CMS, valider les deux langues de chaque étude de cas puis définir le réglage public `projects.source` à la valeur JSON `"cms"` ;
5. lancer toute la chaîne locale de `TESTING.md` ;
6. créer un projet Vercel **Hobby personnel**, sans essai Pro, connecté au dépôt ;
7. configurer les variables d'environnement pour Production et Preview, sans exposer les secrets ;
8. déployer une preview, exécuter smoke tests, recette responsive, accessibilité et parcours admin ;
9. définir `NEXT_PUBLIC_SITE_URL` sur le domaine final puis redéployer ;
10. vérifier canonical, sitemap, robots, cartes sociales et CV sur l'URL finale.

## Variables de production

- publiques : `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ;
- serveur : `SUPABASE_SERVICE_ROLE_KEY`, `CONTACT_FINGERPRINT_SECRET`, éventuellement `GITHUB_TOKEN` ;
- option : `NEXT_PUBLIC_ANALYTICS_ENABLED=false` jusqu'à validation explicite.

Les previews ne doivent pas partager une base contenant des messages réels si plusieurs personnes peuvent y accéder. À défaut d'un second projet Free disponible, désactiver les variables Supabase dans les previews publiques.

## Publication et rollback

- la branche `main` n'est fusionnée qu'après la CI verte ;
- conserver le déploiement Vercel précédemment validé ;
- en cas de régression applicative, promouvoir ce déploiement antérieur ;
- ne jamais réinitialiser la base pour un rollback ; appliquer une nouvelle migration corrective additive ;
- exporter la base avant une évolution de schéma majeure, car Supabase Free n'inclut pas les sauvegardes automatiques.

## Exploitation

- contrôler chaque semaine les messages admin, erreurs de fonctions et quotas ;
- contrôler chaque mois les alertes Dependabot, liens publics, volume PostgreSQL et Storage ;
- exporter périodiquement le schéma et les données critiques vers un stockage local chiffré ;
- laisser les analytics désactivés s'ils ne servent pas une décision produit ;
- si un plafond gratuit est approché, réduire/archiver les données ou auto-héberger, sans activer une offre payante.

## Critères de mise en ligne

- migrations et RLS testées sur l'instance cible ;
- CI, build, smoke tests et recette manuelle verts ;
- contenus FR/EN relus, sans placeholder public ni métrique inventée ;
- formulaire, administration et rollback testés ;
- audit Lighthouse conforme aux seuils du projet ;
- conditions actuelles des plans gratuits revérifiées ; coût estimé et plafond de dépense : 0 €.
