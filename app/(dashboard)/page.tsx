'use client';

import { useQuery } from '@tanstack/react-query';
import { useStreamerStore } from '@/lib/store';
import { StreamerCard } from '@/components/streamer-card';
import { Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Demo streamers to show when API isn't configured
const DEMO_STREAMERS = [
  {
    id: 'demo:summit1g',
    username: 'summit1g',
    platform: 'twitch' as const,
    isLive: false,
    lastChecked: new Date().toISOString(),
  },
  {
    id: 'demo:xqc',
    username: 'xQc',
    platform: 'twitch' as const,
    isLive: false,
    lastChecked: new Date().toISOString(),
  },
  {
    id: 'demo:trainwreckstv',
    username: 'Trainwreckstv',
    platform: 'kick' as const,
    isLive: false,
    lastChecked: new Date().toISOString(),
  },
  {
    id: 'demo:moistcr1tikal',
    username: 'MoistCr1TiKaL',
    platform: 'youtube' as const,
    isLive: false,
    lastChecked: new Date().toISOString(),
  },
];

export default function HomePage() {
  const { followedStreamers } = useStreamerStore();

  // Get live status for followed streamers
  const { data: followedStreamersData, isLoading: loadingFollowed } = useQuery({
    queryKey: ['streamers', 'followed', followedStreamers],
    queryFn: async () => {
      if (followedStreamers.length === 0) return [];

      const grouped = followedStreamers.reduce<Record<string, string[]>>(
        (acc, id) => {
          const [platform, username] = id.split(':');
          if (!acc[platform]) acc[platform] = [];
          acc[platform].push(username);
          return acc;
        },
        {}
      );

      const results = await Promise.all([
        grouped.twitch
          ? fetch(`/api/twitch?usernames=${grouped.twitch.join(',')}`).then((r) => r.json().catch(() => []))
          : Promise.resolve([]),
        grouped.youtube
          ? fetch(`/api/youtube?channelIds=${grouped.youtube.join(',')}`).then((r) => r.json().catch(() => []))
          : Promise.resolve([]),
        grouped.kick
          ? fetch(`/api/kick?usernames=${grouped.kick.join(',')}`).then((r) => r.json().catch(() => []))
          : Promise.resolve([]),
      ]);

      return results.flat();
    },
    refetchInterval: 60000,
    enabled: followedStreamers.length > 0,
  });

  // Get recommendations for each platform
  const { data: recommendations, isLoading: loadingRecommendations, error: recError } = useQuery({
    queryKey: ['streamers', 'recommendations'],
    queryFn: async () => {
      const results = await Promise.allSettled([
        fetch(`/api/twitch?search=gaming`).then((r) => r.json().catch(() => [])),
        fetch(`/api/kick?search=gaming`).then((r) => r.json().catch(() => [])),
        fetch(`/api/youtube?search=gaming`).then((r) => r.json().catch(() => [])),
      ]);

      return {
        twitch: results[0].status === 'fulfilled' ? results[0].value.slice(0, 5) : [],
        kick: results[1].status === 'fulfilled' ? results[1].value.slice(0, 5) : [],
        youtube: results[2].status === 'fulfilled' ? results[2].value.slice(0, 5) : [],
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  const liveFollowed = followedStreamersData?.filter((s: any) => s.isLive) || [];
  const hasApiConfigured = !recError && (recommendations as any)?.twitch?.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Mixer</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-muted-foreground"
            >
              Home
            </Link>
            <Link
              href="/library"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Library
            </Link>
          </div>

          <Link
            href="/search"
            className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-accent"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8">
        {/* API Configuration Notice */}
        {!hasApiConfigured && (
          <div className="mb-8 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-500">API Credentials Required</h3>
                <p className="mt-1 text-sm text-yellow-500/80">
                  To see live streams and search results, add your Twitch and YouTube API credentials to <code className="bg-yellow-500/20 px-1.5 py-0.5 rounded text-xs">.env.local</code>.
                </p>
                <p className="mt-2 text-xs text-yellow-500/60">
                  Check <code className="bg-yellow-500/20 px-1.5 py-0.5 rounded">.env.local.example</code> for instructions.
                </p>
              </div>
            </div>
          </div>
        )}

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">
            Live Now {followedStreamers.length > 0 && `(${liveFollowed.length}/${followedStreamers.length})`}
          </h2>

          {loadingFollowed ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : liveFollowed.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {liveFollowed.map((streamer: any) => (
                <StreamerCard key={streamer.id} streamer={streamer} />
              ))}
            </div>
          ) : followedStreamers.length > 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              <p>No followed streamers are currently live.</p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="mb-2 text-muted-foreground">
                You&apos;re not following anyone yet.
              </p>
              <Link
                href="/search"
                className="text-primary hover:underline"
              >
                Search for streamers to follow →
              </Link>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">
            {hasApiConfigured ? 'Discover' : 'Popular Streamers'}
          </h2>

          {!hasApiConfigured ? (
            // Show demo streamers when API isn't configured
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {DEMO_STREAMERS.map((streamer) => (
                <div
                  key={streamer.id}
                  className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="text-lg font-bold">
                          {streamer.username[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{streamer.username}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {streamer.platform}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">Offline</span>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Add API credentials to see live status
                    </div>
                    <Link
                      href={`/watch/${streamer.platform}/${streamer.username.toLowerCase()}`}
                      className="mt-3 block w-full rounded-md border bg-background px-3 py-2 text-center text-sm hover:bg-accent"
                    >
                      Visit Channel
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : loadingRecommendations ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {(recommendations as any)?.twitch?.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Twitch</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {recommendations?.twitch.map((streamer: any) => (
                      <StreamerCard key={streamer.id} streamer={streamer} />
                    ))}
                  </div>
                </div>
              )}

              {(recommendations as any)?.kick?.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Kick</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {recommendations?.kick.map((streamer: any) => (
                      <StreamerCard key={streamer.id} streamer={streamer} />
                    ))}
                  </div>
                </div>
              )}

              {(recommendations as any)?.youtube?.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold">YouTube</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {recommendations?.youtube.map((streamer: any) => (
                      <StreamerCard key={streamer.id} streamer={streamer} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
