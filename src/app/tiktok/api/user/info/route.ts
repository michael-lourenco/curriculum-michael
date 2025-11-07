import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/tiktok';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    let accessToken = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    } else {
      const searchParams = request.nextUrl.searchParams;
      accessToken = searchParams.get('access_token') || '';
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    const user = new User({
      access_token: accessToken,
      graph_version: 'v2',
    });

    const searchParams = request.nextUrl.searchParams;
    const fieldsParam = searchParams.get('fields');
    const fields = fieldsParam ? fieldsParam.split(',') : [];

    const userInfo = await user.getSelf(
      fields.length > 0 ? { fields } : {}
    );

    if (userInfo.error) {
      return NextResponse.json(
        { error: 'Failed to get user info', details: userInfo.error },
        { status: 400 }
      );
    }

    return NextResponse.json(userInfo);
  } catch (error: any) {
    console.error('Error getting user info:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

