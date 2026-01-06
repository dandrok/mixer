import type { Streamer } from '@/types';
import { StreamerThumbnail } from './streamer-thumbnail';
import { StreamerInfo } from './streamer-info';
import { StreamerMetadata } from './streamer-metadata';

interface StreamerCardProps {
  streamer: Streamer;
}

export function StreamerCard({ streamer }: StreamerCardProps) {
  const usernamePart = streamer.id.split(':')[1];

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <StreamerThumbnail
        thumbnailUrl={streamer.thumbnailUrl || null}
        title={streamer.title || ''}
        username={streamer.username}
        isLive={streamer.isLive}
        viewers={streamer.viewers}
        platform={streamer.platform}
        usernamePart={usernamePart}
      />

      <div className="p-4">
        <StreamerInfo
          avatarUrl={streamer.avatarUrl || null}
          username={streamer.username}
          platform={streamer.platform}
          category={streamer.category || null}
          streamerId={streamer.id}
          usernamePart={usernamePart}
        />

        <StreamerMetadata
          title={streamer.title || null}
          startedAt={streamer.startedAt || null}
          platform={streamer.platform}
          usernamePart={usernamePart}
        />
      </div>
    </div>
  );
}
