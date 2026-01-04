'use client';

import YouTube from 'react-youtube';

export function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <YouTube
        videoId={videoId}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            playsinline: 1,
          },
        }}
        className="h-full w-full"
      />
    </div>
  );
}
