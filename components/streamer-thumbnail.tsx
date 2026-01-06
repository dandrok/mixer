import Image from 'next/image';
import Link from 'next/link';
import { LiveIndicator } from './live-indicator';

interface StreamerThumbnailProps {
  thumbnailUrl: string | null;
  title: string;
  username: string;
  isLive: boolean;
  viewers: number | undefined;
  platform: string;
  usernamePart: string;
}

export function StreamerThumbnail({
  thumbnailUrl,
  title,
  username,
  isLive,
  viewers,
  platform,
  usernamePart,
}: StreamerThumbnailProps) {
  return (
    <Link href={`/watch/${platform}/${usernamePart}`}>
      <div className="relative aspect-video overflow-hidden bg-muted">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title || username}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl font-bold text-muted-foreground/50">
              {username[0]?.toUpperCase()}
            </span>
          </div>
        )}
        {isLive && (
          <div className="absolute left-2 top-2">
            <LiveIndicator />
          </div>
        )}
        {viewers !== undefined && (
          <div className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
            {viewers.toLocaleString()} viewers
          </div>
        )}
      </div>
    </Link>
  );
}
