import type { TwitchStreamResponse, Streamer } from '@/types';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || '';
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || '';

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get Twitch access token');
  }

  const data = await response.json();
  accessToken = data.access_token as string;
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000; // 5min buffer

  if (!accessToken) {
    throw new Error('Failed to obtain access token');
  }

  return accessToken;
}

export async function getTwitchStreamStatus(usernames: string[]): Promise<Streamer[]> {
  if (usernames.length === 0) return [];

  const token = await getAccessToken();

  const response = await fetch(
    `https://api.twitch.tv/helix/streams?${usernames.map((u) => `user_login=${u}`).join('&')}`,
    {
      headers: {
        'Client-Id': TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Twitch streams');
  }

  const data: TwitchStreamResponse = await response.json();

  return data.data.map((stream) => ({
    id: `twitch:${stream.user_login}`,
    username: stream.user_name,
    platform: 'twitch' as const,
    avatarUrl: undefined,
    isLive: true,
    streamUrl: `https://twitch.tv/${stream.user_login}`,
    viewers: stream.viewer_count,
    thumbnailUrl: stream.thumbnail_url
      .replace('{width}', '640')
      .replace('{height}', '360'),
    title: stream.title,
    category: stream.game_name,
    startedAt: stream.started_at,
    lastChecked: new Date().toISOString(),
  }));
}

export async function searchTwitch(query: string): Promise<Streamer[]> {
  const token = await getAccessToken();

  const response = await fetch(
    `https://api.twitch.tv/helix/search/channels?query=${encodeURIComponent(query)}&first=5`,
    {
      headers: {
        'Client-Id': TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to search Twitch');
  }

  const data = await response.json();

  return (data.data || []).map((channel: any) => ({
    id: `twitch:${channel.broadcaster_login}`,
    username: channel.display_name || channel.broadcaster_name,
    platform: 'twitch' as const,
    avatarUrl: channel.thumbnail_url,
    isLive: channel.is_live,
    streamUrl: `https://twitch.tv/${channel.broadcaster_login}`,
    viewers: channel.is_live ? channel.viewer_count : undefined,
    thumbnailUrl: channel.thumbnail_url,
    title: channel.title,
    category: channel.game_name,
    startedAt: channel.started_at,
    lastChecked: new Date().toISOString(),
  }));
}
