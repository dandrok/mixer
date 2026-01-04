export function KickEmbed({ username }: { username: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={`https://player.kick.com/${username}`}
        className="h-full w-full border-0"
        allowFullScreen
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
