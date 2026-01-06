import Image from 'next/image';
import Link from 'next/link';
import type { Platform } from '@/types';
import { PlatformBadge } from './platform-badge';
import { FollowButton } from './follow-button';

interface StreamerInfoProps {
  avatarUrl: string | null;
  username: string;
  platform: Platform;
  category: string | null;
  streamerId: string;
  usernamePart: string;
}

export function StreamerInfo({
  avatarUrl,
  username,
  platform,
  category,
  streamerId,
  usernamePart,
}: StreamerInfoProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {avatarUrl && (
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={avatarUrl}
              alt={username}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <Link
            href={`/watch/${platform}/${usernamePart}`}
            className="block truncate font-semibold hover:underline"
          >
            {username}
          </Link>
          <div className="flex items-center gap-2">
            <PlatformBadge platform={platform} />
            {category && (
              <span className="truncate text-xs text-muted-foreground">
                {category}
              </span>
            )}
          </div>
        </div>
      </div>
      <FollowButton streamerId={streamerId} />
    </div>
  );
}
