import type { Streamer, KickChannelResponse } from '@/types';

export async function getKickStreamStatus(usernames: string[]): Promise<Streamer[]> {
  const results = await Promise.allSettled(
    usernames.map((username) =>
      fetch(`https://kick.com/api/v2/channels/${username}`).then(
        (res) => res.json() as Promise<KickChannelResponse>
      )
    )
  );

  return results
    .filter((r) => r.status === 'fulfilled' && r.value.livelink)
    .map((r) => {
      const data = (r as PromiseFulfilledResult<KickChannelResponse>).value;
      return {
        id: `kick:${data.user?.username}`,
        username: data.user?.username || '',
        platform: 'kick' as const,
        avatarUrl: data.user?.profile_pic,
        isLive: true,
        streamUrl: data.livelink || `https://kick.com/${data.user?.username}`,
        viewers: data.livestream?.viewer_count,
        thumbnailUrl: data.livestream?.thumbnail_url,
        title: data.livestream?.title,
        category: data.livestream?.category?.name,
        startedAt: data.livestream?.created_at,
        lastChecked: new Date().toISOString(),
      };
    });
}

export async function searchKick(query: string): Promise<Streamer[]> {
  const response = await fetch(`https://kick.com/api/v2/search/channels?query=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error('Failed to search Kick');
  }

  const data = await response.json();

  return (data.data || []).map((channel: any) => ({
    id: `kick:${channel.slug}`,
    username: channel.username,
    platform: 'kick' as const,
    avatarUrl: profilePicUrl(channel.profile_pic),
    isLive: channel.is_live,
    streamUrl: `https://kick.com/${channel.slug}`,
    viewers: channel.is_live ? channel.viewer_count : undefined,
    thumbnailUrl: channel.livestream?.thumbnail_url,
    title: channel.livestream?.title,
    category: channel.livestream?.category?.name,
    startedAt: channel.livestream?.created_at,
    lastChecked: new Date().toISOString(),
  }));
}

// Kick profile pics might have a broken URL format
function profilePicUrl(url: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('//')) return 'https:' + url;
  return url;
}
