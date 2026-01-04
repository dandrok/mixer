import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Streamer, StoredData } from '@/types';

interface StreamerStore {
  followedStreamers: string[];
  followedAt: Record<string, string>;
  followStreamer: (id: string) => void;
  unfollowStreamer: (id: string) => void;
  isFollowing: (id: string) => boolean;
}

export const useStreamerStore = create<StreamerStore>()(
  persist(
    (set, get) => ({
      followedStreamers: [],
      followedAt: {},

      followStreamer: (id: string) => {
        set((state) => {
          if (state.followedStreamers.includes(id)) {
            return state;
          }
          return {
            followedStreamers: [...state.followedStreamers, id],
            followedAt: {
              ...state.followedAt,
              [id]: new Date().toISOString(),
            },
          };
        });
      },

      unfollowStreamer: (id: string) => {
        set((state) => ({
          followedStreamers: state.followedStreamers.filter((s) => s !== id),
          followedAt: Object.fromEntries(
            Object.entries(state.followedAt).filter(([key]) => key !== id)
          ),
        }));
      },

      isFollowing: (id: string) => {
        return get().followedStreamers.includes(id);
      },
    }),
    {
      name: 'mixer-storage',
    }
  )
);
