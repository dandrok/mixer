'use client';

import { useQuery } from '@tanstack/react-query';
import { useStreamerStore } from '@/lib/store';
import { StreamerCard } from '@/components/streamer-card';
import Link from 'next/link';

export default function LibraryPage() {
  const { followedStreamers } = useStreamerStore();

  const { data: streamersData, isLoading } = useQuery({
    queryKey: ['streamers', 'library', followedStreamers],
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
          ? fetch(`/api/twitch?usernames=${grouped.twitch.join(',')}`).then((r) => r.json())
          : Promise.resolve([]),
        grouped.youtube
          ? fetch(`/api/youtube?channelIds=${grouped.youtube.join(',')}`).then((r) => r.json())
          : Promise.resolve([]),
        grouped.kick
          ? fetch(`/api/kick?usernames=${grouped.kick.join(',')}`).then((r) => r.json())
          : Promise.resolve([]),
      ]);

      return results.flat();
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const liveStreamers = streamersData?.filter((s: any) => s.isLive) || [];
  const offlineStreamers = followedStreamers
    .map((id) => {
      const live = streamersData?.find((s: any) => s.id === id);
      if (live) return live;
      const [platform, username] = id.split(':');
      return {
        id,
        username,
        platform,
        isLive: false,
      };
    })
    .filter((s) => !s.isLive);

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
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/library"
              className="text-sm font-medium text-foreground hover:text-muted-foreground"
            >
              Library
            </Link>
          </div>

          <Link
            href="/search"
            className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-accent"
          >
            <span>Search</span>
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Library</h1>

        {followedStreamers.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="mb-2 text-lg text-muted-foreground">
              Your library is empty
            </p>
            <p className="mb-4 text-muted-foreground">
              Follow some streamers to see them here
            </p>
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Find Streamers
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {liveStreamers.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold">
                  Live ({liveStreamers.length})
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {liveStreamers.map((streamer: any) => (
                    <StreamerCard key={streamer.id} streamer={streamer} />
                  ))}
                </div>
              </section>
            )}

            {offlineStreamers.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold">
                  Offline ({offlineStreamers.length})
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {offlineStreamers.map((streamer: any) => (
                    <div
                      key={streamer.id}
                      className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <span className="text-lg font-bold">
                              {streamer.username[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold">{streamer.username}</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {streamer.platform}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
