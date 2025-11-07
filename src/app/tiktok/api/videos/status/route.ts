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

export async function POST(request: NextRequest) {
  try {
    const accessToken = resolveAccessToken(request);
    if (!accessToken) {
      return NextResponse.json(
        {
          error: 'Access token required',
          message: 'Você precisa autenticar primeiro. Acesse /tiktok/api/auth/authorize com os escopos necessários.',
        },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const publishId = body?.publish_id || request.nextUrl.searchParams.get('publish_id');

    if (!publishId) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Informe "publish_id" no corpo da requisição ou via query string.',
        },
        { status: 400 }
      );
    }

    const post = new Post({
      access_token: accessToken,
      graph_version: 'v2',
    });

    const statusResponse = await post.fetchStatus({ publish_id: publishId });

    return NextResponse.json({
      publish_id: publishId,
      status: statusResponse,
    });
  } catch (error: any) {
    console.error('Error fetching publish status:', error);
    return NextResponse.json(
      {
        error: 'status_error',
        message: error.message || 'Erro ao consultar status.',
      },
      { status: 500 }
    );
  }
}
