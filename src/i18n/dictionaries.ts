import type { Locale } from "./config";

const dictionaries = {
  fr: {
    languageName: "Français",
    alternateLanguageName: "English",
    skipToContent: "Aller au contenu principal",
    navigationLabel: "Navigation principale",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    switchLanguage: "Afficher la version anglaise",
    nav: {
      home: "Accueil",
      projects: "Projets",
      journey: "Parcours",
      skills: "Compétences",
      certifications: "Certifications",
      blog: "Blog",
      now: "Maintenant",
      contact: "Contact",
      search: "Recherche",
      resume: "CV",
    },
    footer: {
      navigation: "Navigation",
      elsewhere: "Ailleurs",
      rights: "Tous droits réservés.",
      builtWith: "Conçu et développé avec soin à Fès, Maroc.",
    },
    states: {
      loading: "Chargement en cours",
      emptyTitle: "Aucun contenu pour le moment",
      emptyDescription: "Cette section sera mise à jour prochainement.",
      errorTitle: "Impossible de charger ce contenu",
      errorDescription: "Réessayez dans quelques instants.",
      retry: "Réessayer",
      unavailableTitle: "Contenu indisponible",
      unavailableDescription: "Ce contenu n'est pas encore disponible dans cette langue.",
    },
  },
  en: {
    languageName: "English",
    alternateLanguageName: "Français",
    skipToContent: "Skip to main content",
    navigationLabel: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLanguage: "View the French version",
    nav: {
      home: "Home",
      projects: "Projects",
      journey: "Journey",
      skills: "Skills",
      certifications: "Certifications",
      blog: "Blog",
      now: "Now",
      contact: "Contact",
      search: "Search",
      resume: "Resume",
    },
    footer: {
      navigation: "Navigation",
      elsewhere: "Elsewhere",
      rights: "All rights reserved.",
      builtWith: "Designed and built with care in Fez, Morocco.",
    },
    states: {
      loading: "Loading",
      emptyTitle: "Nothing here yet",
      emptyDescription: "This section will be updated soon.",
      errorTitle: "This content could not be loaded",
      errorDescription: "Please try again in a moment.",
      retry: "Try again",
      unavailableTitle: "Content unavailable",
      unavailableDescription: "This content is not available in this language yet.",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
