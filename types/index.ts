export type Platform = 'twitch' | 'kick' | 'youtube';

export interface Streamer {
  id: string;
  username: string;
  platform: Platform;
  avatarUrl?: string;
  isLive: boolean;
  streamUrl?: string;
  viewers?: number;
  thumbnailUrl?: string;
  title?: string;
  category?: string;
  startedAt?: string;
  lastChecked: string;
}

export interface StoredData {
  followedStreamers: string[];
  followedAt: Record<string, string>;
  settings: {
    theme: 'dark' | 'light' | 'system';
    refreshInterval: number;
  };
}

export interface TwitchStreamResponse {
  data: Array<{
    id: string;
    user_login: string;
    user_name: string;
    title: string;
    viewer_count: number;
    thumbnail_url: string;
    started_at: string;
    game_id: string;
    game_name: string;
  }>;
}

export interface KickChannelResponse {
  livelink?: string;
  user?: {
    username: string;
    profile_pic: string;
  };
  livestream?: {
    thumbnail_url?: string;
    title: string;
    viewer_count: number;
    category?: {
      name: string;
    };
    created_at: string;
  };
}

export interface YouTubeVideoResponse {
  items: Array<{
    id: string;
    snippet: {
      title: string;
      channelTitle: string;
      channelId: string;
      thumbnails: {
        medium?: { url: string };
        high?: { url: string };
        default?: { url: string };
      };
      liveBroadcastContent: string;
    };
    liveStreamingDetails?: {
      actualStartTime: string;
      concurrentViewers: string;
    };
  }>;
}
