import { Plus, Minus } from 'lucide-react';
import { useStreamerStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  streamerId: string;
  className?: string;
}

export function FollowButton({ streamerId, className = '' }: FollowButtonProps) {
  const { isFollowing, followStreamer, unfollowStreamer } = useStreamerStore();
  const following = isFollowing(streamerId);

  return (
    <button
      onClick={() => {
        if (following) {
          unfollowStreamer(streamerId);
        } else {
          followStreamer(streamerId);
        }
      }}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
        following
          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          : 'bg-primary text-primary-foreground hover:bg-primary/90',
        className
      )}
    >
      {following ? (
        <>
          <Minus className="w-4 h-4" />
          <span>Unfollow</span>
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          <span>Follow</span>
        </>
      )}
    </button>
  );
}
