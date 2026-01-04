export function TwitchEmbed({ username }: { username: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={`https://player.twitch.tv/?channel=${username}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=true`}
        className="h-full w-full border-0"
        allowFullScreen
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
