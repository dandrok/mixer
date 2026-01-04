import { NextRequest, NextResponse } from 'next/server';
import { getKickStreamStatus, searchKick } from '@/lib/api/kick';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const usernames = searchParams.get('usernames');
    const search = searchParams.get('search');

    if (search) {
      const results = await searchKick(search);
      return NextResponse.json(results);
    }

    if (!usernames) {
      return NextResponse.json({ error: 'Missing usernames parameter' }, { status: 400 });
    }

    const usernameList = usernames.split(',');
    const results = await getKickStreamStatus(usernameList);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Kick API error:', error);
    return NextResponse.json({ error: 'Failed to fetch from Kick' }, { status: 500 });
  }
}
