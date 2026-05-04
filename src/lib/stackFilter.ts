type Listener = (tech: string | null) => void;
const listeners = new Set<Listener>();
let current: string | null = null;

export const stackFilter = {
  subscribe: (fn: Listener) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  emit: (tech: string | null) => {
    current = tech;
    listeners.forEach((l) => l(tech));
  },
  getCurrent: () => current,
};
