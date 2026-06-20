import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SRSCard {
  command: string;
  language: string;
  easeFactor: number;
  interval: number;
  nextReview: string;
  reviewCount: number;
  lastReviewed: string | null;
}

interface SRSState {
  cards: Record<string, SRSCard>;
  addCard: (command: string, language: string) => void;
  reviewCard: (command: string, quality: 'easy' | 'good' | 'hard' | 'forgot') => void;
  getDueCards: () => SRSCard[];
  getCardsByLanguage: (lang: string) => SRSCard[];
}

function getDefaultInterval(quality: string, currentInterval: number, easeFactor: number): { interval: number; easeFactor: number } {
  switch (quality) {
    case 'easy':
      return { interval: Math.max(1, Math.round(currentInterval * easeFactor * 1.3)), easeFactor: Math.min(3, easeFactor + 0.15) };
    case 'good':
      return { interval: Math.max(1, Math.round(currentInterval * easeFactor)), easeFactor: Math.min(3, easeFactor + 0.1) };
    case 'hard':
      return { interval: Math.max(1, Math.round(currentInterval * 0.6)), easeFactor: Math.max(1.3, easeFactor - 0.2) };
    case 'forgot':
      return { interval: 1, easeFactor: Math.max(1.3, easeFactor - 0.3) };
    default:
      return { interval: currentInterval, easeFactor };
  }
}

export const useSRSStore = create<SRSState>()(
  persist(
    (set, get) => ({
      cards: {},

      addCard: (command, language) => {
        const key = `${language}:${command}`;
        if (get().cards[key]) return;
        set((state) => ({
          cards: {
            ...state.cards,
            [key]: {
              command,
              language,
              easeFactor: 2.5,
              interval: 1,
              nextReview: new Date().toISOString(),
              reviewCount: 0,
              lastReviewed: null,
            },
          },
        }));
      },

      reviewCard: (command, quality) => {
        const key = Object.keys(get().cards).find(k => get().cards[k].command === command);
        if (!key) return;
        const card = get().cards[key];
        const { interval, easeFactor } = getDefaultInterval(quality, card.interval, card.easeFactor);
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + interval);
        set((state) => ({
          cards: {
            ...state.cards,
            [key]: {
              ...card,
              interval,
              easeFactor,
              nextReview: nextDate.toISOString(),
              reviewCount: card.reviewCount + 1,
              lastReviewed: new Date().toISOString(),
            },
          },
        }));
      },

      getDueCards: () => {
        const now = new Date();
        return Object.values(get().cards).filter(c => new Date(c.nextReview) <= now);
      },

      getCardsByLanguage: (lang) => {
        return Object.values(get().cards).filter(c => c.language === lang);
      },
    }),
    { name: 'gitnova-srs' }
  )
);
