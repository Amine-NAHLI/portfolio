# Politique de coût nul

Le projet est conçu pour rester à 0 €. Il n'intègre aucune carte bancaire, aucun essai Pro, aucun dépassement facturé et aucune API au token.

## Services retenus

### Vercel Hobby

Le plan Hobby est gratuit, réservé aux projets personnels et suspend le service lorsque ses plafonds sont dépassés au lieu de vendre du dépassement. Utiliser uniquement un compte Hobby personnel, ne pas activer l'essai Pro et ne pas enregistrer de moyen de paiement. Une alternative entièrement auto-hébergeable est un serveur Node.js derrière un reverse proxy libre.

### Supabase Free

Le plan Free fournit notamment deux projets actifs, 500 Mo de base, 1 Go de stockage et 5 Go d'egress. Les projets peu actifs peuvent être mis en pause après sept jours et les sauvegardes automatiques ne sont pas incluses. Le plan Free ne facture pas les dépassements : des restrictions de service s'appliquent. Ne jamais passer l'organisation en Pro ; exporter régulièrement PostgreSQL manuellement.

### GitHub Free

Les Actions utilisant les runners standards sont gratuites pour un dépôt public. Un dépôt privé dispose d'un quota limité et peut entraîner une facturation au-delà : pour garantir 0 €, garder le dépôt public ou utiliser un runner auto-hébergé et définir un budget bloquant à 0. Dependabot est gratuit.

## Services volontairement absents

- aucun Sentry, PostHog, Google Analytics, Clarity ou Vercel Analytics ; les compteurs internes sont optionnels ;
- aucun Resend ni fournisseur e-mail ; les messages sont stockés dans l'administration ;
- aucun Upstash ; le rate limiting utilise PostgreSQL ;
- aucun fournisseur d'IA distant ; le workflow manuel reste complet ;
- aucun service de test visuel payant ; recette locale et CI native.

## Revue périodique

Les offres externes évoluent. Avant chaque déploiement majeur, revérifier les pages officielles Vercel Hobby, Supabase Pricing/Cost Control et GitHub Actions Billing. Si une offre ne garantit plus 0 €, désactiver l'intégration ou migrer vers une solution libre auto-hébergée.
