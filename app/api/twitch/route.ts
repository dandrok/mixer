import { NextRequest, NextResponse } from 'next/server';
import { getTwitchStreamStatus, searchTwitch } from '@/lib/api/twitch';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const usernames = searchParams.get('usernames');
    const search = searchParams.get('search');

    if (search) {
      const results = await searchTwitch(search);
      return NextResponse.json(results);
    }

    if (!usernames) {
      return NextResponse.json({ error: 'Missing usernames parameter' }, { status: 400 });
    }

    const usernameList = usernames.split(',');
    const results = await getTwitchStreamStatus(usernameList);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Twitch API error:', error);
    return NextResponse.json({ error: 'Failed to fetch from Twitch' }, { status: 500 });
  }
}
