# Sécurité

## Modèle de confiance

Le navigateur est non fiable. Toute mutation est validée côté serveur. L'accès administrateur exige à la fois une session Supabase Auth valide et un UUID actif dans `public.admin_users`. La clé `service_role` est importée uniquement depuis des modules serveur.

## Mesures en place

- RLS activée sur toutes les tables exposées ; politiques publiques limitées au contenu publié et validé ;
- fonctions SQL privilégiées avec `search_path` vide et droits révoqués explicitement ;
- comparaison d'origine pour les mutations publiques et administratives ;
- corps JSON bornés, schémas allowlistés et messages d'erreur non sensibles ;
- limitation du contact par fenêtre temporelle, honeypot et empreinte HMAC de l'IP ; aucune IP brute conservée ;
- URL GitHub limitée à `https://github.com/{owner}/{repository}` puis URL API construite en interne afin d'éviter SSRF ;
- médias privés avec liste MIME et limite de 5 Mo ;
- CSP, HSTS, anti-framing, `nosniff`, politique de référent et permissions minimales ;
- pages admin `no-store` et `noindex` ;
- journal d'audit des mutations de contenu ;
- rendu Markdown sans HTML arbitraire et JSON-LD échappé.

## Secrets

Les fichiers `.env*` restent ignorés sauf `.env.example`. Les variables publiques ne doivent contenir que l'URL et la clé publiable Supabase. Les secrets serveur sont `SUPABASE_SERVICE_ROLE_KEY`, `CONTACT_FINGERPRINT_SECRET` et, facultativement, `GITHUB_TOKEN`.

Générer le secret d'empreinte avec un générateur cryptographique local, le stocker dans les variables d'environnement de l'hébergeur et le faire tourner en cas d'exposition. Une rotation change seulement les empreintes temporaires de rate limiting.

## Contrôles de production obligatoires

1. appliquer les migrations sur une base de préproduction vide ;
2. exécuter les tests de politiques avec un visiteur anonyme, un utilisateur authentifié non admin et l'admin allowlisté ;
3. confirmer qu'aucune clé privilégiée n'apparaît dans les bundles ou réponses ;
4. vérifier l'origine canonique et `CONTACT_FINGERPRINT_SECRET` ;
5. tester le téléchargement de médias interdits, les limites de débit et les accès directs aux routes admin ;
6. lancer `npm audit --omit=dev` et traiter toute vulnérabilité exploitable avant publication.

## Limites connues

- La CSP principale autorise actuellement les styles et scripts inline requis par le rendu Next.js ; elle réduit les autres sources au site, à Supabase et à l'API GitHub. Une CSP à nonce dynamique est une amélioration future possible.
- Supabase Free ne fournit pas de sauvegardes automatiques. Un export SQL manuel régulier est requis.
- Le rate limiting en base est adapté au trafic d'un portfolio, pas à une charge hostile distribuée à grande échelle.
- Aucun e-mail n'est envoyé : cela évite une nouvelle surface fournisseur et toute facturation ; l'administration est la boîte de réception.

Les messages de contact ne doivent être conservés que le temps nécessaire au suivi. L'administrateur peut les archiver puis les supprimer manuellement ; aucune suppression automatique n'est activée afin d'éviter une perte de données involontaire.

Signaler une vulnérabilité de manière privée au propriétaire du portfolio, sans publier d'informations exploitables.
