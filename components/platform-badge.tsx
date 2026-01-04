import { Tv, Video } from 'lucide-react';
import type { Platform } from '@/types';

interface PlatformBadgeProps {
  platform: Platform;
  className?: string;
}

const platformConfig = {
  twitch: {
    name: 'Twitch',
    color: 'bg-purple-600',
    icon: Tv,
  },
  youtube: {
    name: 'YouTube',
    color: 'bg-red-600',
    icon: Video,
  },
  kick: {
    name: 'Kick',
    color: 'bg-green-600',
    icon: Tv,
  },
};

export function PlatformBadge({ platform, className = '' }: PlatformBadgeProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-white ${config.color} ${className}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.name}</span>
    </div>
  );
}
