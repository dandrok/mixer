import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface StreamerMetadataProps {
  title: string | null;
  startedAt: string | null;
  platform: string;
  usernamePart: string;
}

export function StreamerMetadata({
  title,
  startedAt,
  platform,
  usernamePart,
}: StreamerMetadataProps) {
  return (
    <>
      {title && (
        <Link
          href={`/watch/${platform}/${usernamePart}`}
          className="mt-3 block line-clamp-2 text-sm text-muted-foreground hover:underline"
        >
          {title}
        </Link>
      )}

      {startedAt && (
        <div className="mt-2 text-xs text-muted-foreground">
          Started {formatDistanceToNow(new Date(startedAt), { addSuffix: true })}
        </div>
      )}
    </>
  );
}
