# Architecture Technique

Ce document détaille l'architecture globale, la structure du code frontend, l'infrastructure de base de données, les flux de données et la stratégie de déploiement du portfolio. 

---

## 1. Vue d'Ensemble Globale

L'application repose sur une architecture moderne de type **Jamstack + Backend-as-a-Service**. Elle sépare strictement le rendu frontend, géré par Next.js (Vercel), de la logique de données et de l'authentification (Supabase). Des services tiers sont utilisés de manière découplée pour les fonctionnalités spécifiques (emailing, intelligence artificielle, assets statiques).

![Architecture Globale](./Architecture%20Globale.png)

### Principes
- **App Router de Next.js** : Le rendu serveur (SSR/SSG) est privilégié. Les composants clients sont strictement limités aux interactions (animations, formulaires).
- **Accès Sécurisé** : Toute logique d'accès privilégié (admin) s'exécute côté serveur. Les clés d'API (Supabase Service Role, Groq API) ne sont jamais exposées au client.
- **Performances** : Le contenu public est généré de manière statique au build (SSG) ou via des revalidations asynchrones (ISR), assurant un LCP optimal.

---

## 2. Architecture Frontend (Couches)

Le dépôt suit une organisation en couches inspirée de la *Clean Architecture* adaptée au framework Next.js.

![Architecture Frontend](./Architecture%20Frontend.png)

```text
src/
├── app/                    Couche 1 : Routes, Layouts, Middleware et Endpoints API
│   ├── [locale]/           Site public (Pages SSG/ISR)
│   ├── admin/              CMS et tableau de bord protégés
│   └── api/                Mutations côté serveur (Contact, Admin)
├── components/             Couche 2 : Composants UI réutilisables (par domaine)
├── features/               Couche 3 : Logique métier indépendante de l'UI (requêtes, validations)
├── lib/                    Couche 4 : Infrastructure (Supabase, Auth, Sécurité)
├── i18n/                   Couche 5 : Dictionnaires et gestion multilingue
├── config/                 Couche 5 : Configuration constante du site
└── types/                  Couche 5 : Contrats TypeScript globaux
```

### Frontières strictes
- `src/app/[locale]` orchestre la donnée et l'UI, sans contenir la logique métier d'accès.
- `src/features` encapsule les appels de données et les règles métier (pas de code React).
- `src/lib/supabase` distingue explicitement les instances de clients pour le navigateur, le serveur public, et l'admin.

---

## 3. Modèle de Données (Supabase PostgreSQL)

Toutes les données dynamiques sont gérées via Supabase. Les tables sont protégées par des politiques RLS (*Row Level Security*) strictes.

![Architecture Base de Données](./Architecture%20Base%20de%20Donn%C3%A9es.png)

### Publication et Visibilité
Supabase est la source exclusive des contenus dynamiques (projets, compétences, témoignages).
- Seuls les contenus portant le statut `published` ou `approved` sont visibles par le visiteur.
- L'administration (via Supabase Auth) nécessite une autorisation figurant sur une liste blanche côté serveur.
- Le formulaire de contact insère les messages dans `messages` via le rôle serveur (la table n'est pas ouverte en insertion publique via RLS).

---

## 4. Flux de Données et Séquences

Le diagramme ci-dessous illustre le parcours de l'information pour 3 flux critiques :
1. **La visite publique** : Le client lit le HTML servi par le cache Edge de Vercel. Les données Supabase sont requêtées lors de la génération.
2. **L'administration** : Toute modification transite par une API Route sécurisée avant d'impacter Supabase.
3. **Le formulaire de contact** : Soumission asynchrone → Validation Serveur → Envoi d'Email via Web3Forms → Stockage DB.

![Flux de Données](./Flux%20de%20Donn%C3%A9es.png)

---

## 5. Stratégie de Déploiement

Le déploiement est conçu pour fonctionner sans friction et avec un coût nul, en exploitant les offres gratuites de Vercel et Supabase.

![Architecture de Déploiement](./Architecture%20de%20D%C3%A9ploiement.png)

### Dégradation Contrôlée (Résilience)
- **Sans Supabase** : Le site public replie élégamment vers le contenu statique du dossier `src/content`. Le portfolio ne crashe pas.
- **Sans Web3Forms** : L'API de contact enregistre le message en base de données. L'admin peut le lire plus tard.
- **Sans quota API** : L'analyse GitHub ou l'IA de traduction (Groq) gère gracieusement la limite de requêtes avec des états de chargement adaptés.
