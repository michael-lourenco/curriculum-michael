import { NextRequest, NextResponse } from 'next/server';
import { Post } from '@/lib/tiktok';

export const dynamic = 'force-dynamic';

function resolveAccessToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  const searchParams = request.nextUrl.searchParams;
  const tokenFromQuery = searchParams.get('access_token');
  if (tokenFromQuery) {
    return tokenFromQuery;
  }

  const tokenFromCookie = request.cookies.get('tiktok_access_token')?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = resolveAccessToken(request);
    if (!accessToken) {
      return NextResponse.json(
        {
          error: 'Access token required',
          message: 'Autentique-se para obter as informações do criador.',
        },
        { status: 401 }
      );
    }

    const post = new Post({
      access_token: accessToken,
      graph_version: 'v2',
    });

    const creatorInfo = await post.queryCreatorInfo({});

    if (creatorInfo.error && creatorInfo.error.code !== 'ok') {
      return NextResponse.json(
        {
          error: 'creator_info_error',
          message: creatorInfo.error.message || 'Não foi possível obter informações do criador.',
          details: creatorInfo,
        },
        { status: 400 }
      );
    }

    const creatorData = creatorInfo.data?.creator_info || creatorInfo.data || {};

    return NextResponse.json({
      success: true,
      creator_info: creatorData,
      raw: creatorInfo,
    });
  } catch (error: any) {
    console.error('Error fetching creator info:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'Erro ao obter informações do criador.',
      },
      { status: 500 }
    );
  }
}
