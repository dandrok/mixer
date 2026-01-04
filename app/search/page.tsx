'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { StreamerCard } from '@/components/streamer-card';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return null;
      const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      return res.json();
    },
    enabled: debouncedQuery.length > 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Mixer</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/library"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Library
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for streamers..."
                className="w-full rounded-md border bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </form>

          {debouncedQuery && (
            <div className="space-y-8">
              {results?.twitch?.length > 0 && (
                <section>
                  <h2 className="mb-4 text-lg font-semibold">Twitch</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {results.twitch.map((streamer: any) => (
                      <StreamerCard key={streamer.id} streamer={streamer} />
                    ))}
                  </div>
                </section>
              )}

              {results?.youtube?.length > 0 && (
                <section>
                  <h2 className="mb-4 text-lg font-semibold">YouTube</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {results.youtube.map((streamer: any) => (
                      <StreamerCard key={streamer.id} streamer={streamer} />
                    ))}
                  </div>
                </section>
              )}

              {results?.kick?.length > 0 && (
                <section>
                  <h2 className="mb-4 text-lg font-semibold">Kick</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {results.kick.map((streamer: any) => (
                      <StreamerCard key={streamer.id} streamer={streamer} />
                    ))}
                  </div>
                </section>
              )}

              {results && results.twitch?.length === 0 && results.youtube?.length === 0 && results.kick?.length === 0 && !isLoading && (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                  No results found for &quot;{debouncedQuery}&quot;
                </div>
              )}
            </div>
          )}

          {!debouncedQuery && (
            <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
              <Search className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Search for streamers across Twitch, YouTube, and Kick</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
