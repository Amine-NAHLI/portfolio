# Portfolio & CMS Headless — Amine Nahli

Un portfolio bilingue (français/anglais) performant, administrable et orienté recrutement. Développé avec une approche Jamstack moderne, il inclut son propre CMS sur-mesure (Dashboard Admin) pour gérer les projets, compétences, certifications et témoignages.

![Architecture Globale](./docs/Architecture%20Globale.png)

## ✨ Fonctionnalités Clés

- **Site public bilingue** : Projets, parcours professionnel, compétences, certifications, et témoignages.
- **Interface d'administration (CMS)** : Protégée par Supabase Auth avec liste blanche. Permet le CRUD complet de tous les contenus.
- **Workflow Éditorial** : Brouillon → Relecture → Validation bilingue → Publication.
- **Analyse GitHub Intégrée** : Récupération factuelle des données de dépôts (technologies, métriques) sans IA générative payante.
- **Formulaire de Contact Sécurisé** : Anti-spam, limitation de débit (rate-limiting) côté serveur, notification par e-mail (Web3Forms) et stockage DB.
- **Qualité & Accessibilité** : SEO technique complet (Données structurées, Sitemap, OpenGraph), scores Lighthouse 100%, conforme WCAG 2.2 AA.
- **Dégradation Contrôlée** : Le site public reste fonctionnel même si la base de données ou les API tierces sont indisponibles.

## 🛠️ Stack Technique

L'architecture s'appuie exclusivement sur des technologies modernes, performantes et hébergées **sans frais** (Free Tiers).

- **Frontend** : Next.js 15 (App Router), React 19, TypeScript
- **Styling** : Tailwind CSS 4, Framer Motion (Animations), Glassmorphism
- **Backend & Base de données** : Supabase (PostgreSQL, Auth, Storage & RLS)
- **Déploiement** : Vercel (SSG / ISR / Serverless Functions)
- **Outils Qualité** : ESLint, Playwright (E2E), Axe (A11y), pgTAP (Tests DB)

👉 **Découvrir l'architecture complète : [Documentation Architecture](./docs/ARCHITECTURE.md)**

## 🚀 Installation Locale

Prérequis : Node.js 22 et npm.

```bash
# 1. Installer les dépendances
npm ci

# 2. Configurer les variables d'environnement
cp .env.example .env.local

# 3. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000` (redirige vers `/fr` par défaut).

## ⚙️ Configuration (.env.local)

Renseignez les variables nécessaires selon le besoin (voir `docs/DEPLOYMENT.md` pour le détail) :

| Variable | Portée | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Publique | URL canonique en production |
| `NEXT_PUBLIC_SUPABASE_URL` | Publique | Endpoint Supabase (Requis pour le CMS) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publique | Clé anonyme Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Serveur | Clé Admin (Contact, Analytics, Mutations) |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Publique | Clé pour l'envoi d'e-mails de contact |
| `CONTACT_FINGERPRINT_SECRET` | Serveur | Secret HMAC anti-spam |

*Note: Le site public fonctionne grâce à un contenu factuel statique de repli si Supabase n'est pas configuré.*

## 📚 Documentation Détaillée

Consultez les fichiers du dossier `docs/` pour approfondir des aspects spécifiques du projet :

- 🏗️ **[Architecture & Flux de données](./docs/ARCHITECTURE.md)** (avec diagrammes)
- 🔒 **[Sécurité & RLS](./docs/SECURITY.md)**
- 🧪 **[Stratégie de Tests](./docs/TESTING.md)**
- 🚀 **[Déploiement & CI/CD](./docs/DEPLOYMENT.md)**
- 💰 **[Stratégie Zéro Coût (Free Tier)](./docs/FREE_TIER.md)**

## 📜 Commandes Utiles

```bash
npm run type-check     # Vérification TypeScript stricte
npm run lint           # ESLint
npm test               # Tests unitaires et sécurité
npm run build          # Build de production optimisé
npm run start          # Lancer le serveur de production (après le build)
npm run test:e2e       # Tests end-to-end (Playwright) et Accessibilité (Axe)
```

## ⚖️ Licence

Ce projet est sous licence MIT — voir le fichier [LICENSE](LICENSE) pour plus de détails.
