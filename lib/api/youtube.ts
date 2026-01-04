import type { Streamer, YouTubeVideoResponse } from '@/types';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

async function searchYouTubeChannels(query: string): Promise<any[]> {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=5&key=${YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to search YouTube channels');
  }

  const data = await response.json();
  return data.items || [];
}

async function getChannelLiveStreams(channelIds: string[]): Promise<Streamer[]> {
  if (channelIds.length === 0) return [];

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&channelId=${channelIds.join(',')}&maxResults=5&key=${YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch YouTube live streams');
  }

  const data: YouTubeVideoResponse = await response.json();

  return data.items.map((item) => ({
    id: `youtube:${item.id}`,
    username: item.snippet.channelTitle,
    platform: 'youtube' as const,
    avatarUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
    isLive: true,
    streamUrl: `https://www.youtube.com/watch?v=${item.id}`,
    viewers: item.liveStreamingDetails?.concurrentViewers
      ? parseInt(item.liveStreamingDetails.concurrentViewers, 10)
      : undefined,
    thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
    title: item.snippet.title,
    category: undefined,
    startedAt: item.liveStreamingDetails?.actualStartTime,
    lastChecked: new Date().toISOString(),
  }));
}

export async function getYouTubeStreamStatus(channelIds: string[]): Promise<Streamer[]> {
  return getChannelLiveStreams(channelIds);
}

export async function searchYouTube(query: string): Promise<Streamer[]> {
  const channels = await searchYouTubeChannels(query);

  const channelIds = channels.map((c) => c.id.channelId);
  const liveStreams = await getChannelLiveStreams(channelIds);

  // Return live streams + offline channels
  const liveIds = new Set(liveStreams.map((s) => s.id.split(':')[1]));

  const offlineChannels = channels
    .filter((c) => !liveIds.has(c.id.channelId))
    .map((channel: any) => ({
      id: `youtube:${channel.id.channelId}`,
      username: channel.snippet.channelTitle,
      platform: 'youtube' as const,
      avatarUrl: channel.snippet.thumbnails.medium?.url || channel.snippet.thumbnails.default?.url,
      isLive: false,
      streamUrl: `https://www.youtube.com/channel/${channel.id.channelId}`,
      lastChecked: new Date().toISOString(),
    }));

  return [...liveStreams, ...offlineChannels];
}
