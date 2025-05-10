
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InteractionState {
  queries: string[];
  addQuery: (query: string) => void;
  clearQueries: () => void;
}

export const useInteractionStore = create<InteractionState>()(
  persist(
    (set) => ({
      queries: [],
      addQuery: (query: string) => set((state) => ({
        queries: [...state.queries.slice(-4), query].slice(-5) // Keep only last 5 queries
      })),
      clearQueries: () => set({ queries: [] })
    }),
    {
      name: 'user-interaction-store'
    }
  )
);
