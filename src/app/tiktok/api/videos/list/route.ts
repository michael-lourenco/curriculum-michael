import { NextRequest, NextResponse } from 'next/server';
import { Video } from '@/lib/tiktok';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    let accessToken = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { max_count, cursor, fields } = body;

    const video = new Video({
      access_token: accessToken,
      graph_version: 'v2',
    });

    const params: Record<string, any> = {};
    if (max_count) params.max_count = max_count;
    if (cursor) params.cursor = cursor;

    const videos = await video.getList(params, fields || []);

    if (videos.error) {
      return NextResponse.json(
        { error: 'Failed to get videos', details: videos.error },
        { status: 400 }
      );
    }

    return NextResponse.json(videos);
  } catch (error: any) {
    console.error('Error listing videos:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

