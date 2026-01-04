'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { TwitchEmbed, KickEmbed, YouTubeEmbed } from '@/components/platform-embeds';
import { PlatformBadge } from '@/components/platform-badge';
import { LiveIndicator } from '@/components/live-indicator';
import { FollowButton } from '@/components/follow-button';

export default function WatchPage() {
  const params = useParams();
  const platform = params.platform as string;
  const username = params.username as string;
  const streamerId = `${platform}:${username}`;

  const { data: streamer, isLoading } = useQuery({
    queryKey: ['streamer', platform, username],
    queryFn: async () => {
      const res = await fetch(`/api/${platform}?usernames=${username}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data[0];
    },
  });

  const getEmbed = () => {
    switch (platform) {
      case 'twitch':
        return <TwitchEmbed username={username} />;
      case 'kick':
        return <KickEmbed username={username} />;
      case 'youtube':
        return <YouTubeEmbed videoId={username} />;
      default:
        return <div className="aspect-video flex items-center justify-center bg-muted">Unsupported platform</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-2xl font-bold">{username}</h1>
                {streamer?.isLive && <LiveIndicator />}
                <PlatformBadge platform={platform as any} />
              </div>
              {streamer?.title && (
                <p className="text-lg text-muted-foreground">{streamer.title}</p>
              )}
              {streamer?.category && (
                <p className="text-sm text-muted-foreground">
                  Playing: {streamer.category}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <FollowButton streamerId={streamerId} />
              <a
                href={streamer?.streamUrl || `https://twitch.tv/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Original</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {getEmbed()}

            {isLoading && (
              <div className="rounded-lg border p-8 text-center text-muted-foreground">
                Loading stream info...
              </div>
            )}

            {!isLoading && !streamer && (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <p className="mb-4">
                  This streamer may not be live or the channel may not exist.
                </p>
                <a
                  href={`https://twitch.tv/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Check on {platform} →
                </a>
              </div>
            )}

            {streamer && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-2 font-semibold">Stream Info</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Platform</dt>
                    <dd className="capitalize">{platform}</dd>
                  </div>
                  {streamer.viewers !== undefined && (
                    <div>
                      <dt className="text-muted-foreground">Viewers</dt>
                      <dd>{streamer.viewers.toLocaleString()}</dd>
                    </div>
                  )}
                  {streamer.startedAt && (
                    <div>
                      <dt className="text-muted-foreground">Started</dt>
                      <dd>{new Date(streamer.startedAt).toLocaleString()}</dd>
                    </div>
                  )}
                  {streamer.category && (
                    <div>
                      <dt className="text-muted-foreground">Category</dt>
                      <dd>{streamer.category}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
