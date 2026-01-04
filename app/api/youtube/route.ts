import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeStreamStatus, searchYouTube } from '@/lib/api/youtube';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const channelIds = searchParams.get('channelIds');
    const search = searchParams.get('search');

    if (search) {
      const results = await searchYouTube(search);
      return NextResponse.json(results);
    }

    if (!channelIds) {
      return NextResponse.json({ error: 'Missing channelIds parameter' }, { status: 400 });
    }

    const channelIdList = channelIds.split(',');
    const results = await getYouTubeStreamStatus(channelIdList);
    return NextResponse.json(results);
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ error: 'Failed to fetch from YouTube' }, { status: 500 });
  }
}
