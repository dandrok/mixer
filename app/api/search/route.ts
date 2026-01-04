import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    // Search all platforms in parallel
    const [twitchRes, youtubeRes, kickRes] = await Promise.allSettled([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/twitch?search=${encodeURIComponent(query)}`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/youtube?search=${encodeURIComponent(query)}`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/kick?search=${encodeURIComponent(query)}`),
    ]);

    const results = {
      twitch: twitchRes.status === 'fulfilled' ? await twitchRes.value.json().catch(() => []) : [],
      youtube: youtubeRes.status === 'fulfilled' ? await youtubeRes.value.json().catch(() => []) : [],
      kick: kickRes.status === 'fulfilled' ? await kickRes.value.json().catch(() => []) : [],
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
