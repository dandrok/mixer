import Link from 'next/link';
import Image from 'next/image';
import type { Streamer } from '@/types';
import { PlatformBadge } from './platform-badge';
import { LiveIndicator } from './live-indicator';
import { FollowButton } from './follow-button';
import { formatDistanceToNow } from 'date-fns';

interface StreamerCardProps {
  streamer: Streamer;
}

export function StreamerCard({ streamer }: StreamerCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <Link href={`/watch/${streamer.platform}/${streamer.id.split(':')[1]}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          {streamer.thumbnailUrl ? (
            <Image
              src={streamer.thumbnailUrl}
              alt={streamer.title || streamer.username}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/50">
                {streamer.username[0]?.toUpperCase()}
              </span>
            </div>
          )}
          {streamer.isLive && (
            <div className="absolute left-2 top-2">
              <LiveIndicator />
            </div>
          )}
          {streamer.viewers !== undefined && (
            <div className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
              {streamer.viewers.toLocaleString()} viewers
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {streamer.avatarUrl && (
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={streamer.avatarUrl}
                  alt={streamer.username}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link
                href={`/watch/${streamer.platform}/${streamer.id.split(':')[1]}`}
                className="block truncate font-semibold hover:underline"
              >
                {streamer.username}
              </Link>
              <div className="flex items-center gap-2">
                <PlatformBadge platform={streamer.platform} />
                {streamer.category && (
                  <span className="truncate text-xs text-muted-foreground">
                    {streamer.category}
                  </span>
                )}
              </div>
            </div>
          </div>
          <FollowButton streamerId={streamer.id} />
        </div>

        {streamer.title && (
          <Link
            href={`/watch/${streamer.platform}/${streamer.id.split(':')[1]}`}
            className="mt-3 block line-clamp-2 text-sm text-muted-foreground hover:underline"
          >
            {streamer.title}
          </Link>
        )}

        {streamer.startedAt && (
          <div className="mt-2 text-xs text-muted-foreground">
            Started {formatDistanceToNow(new Date(streamer.startedAt), { addSuffix: true })}
          </div>
        )}
      </div>
    </div>
  );
}
