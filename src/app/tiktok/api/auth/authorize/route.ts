import { NextRequest, NextResponse } from 'next/server';
import { Authentication } from '@/lib/tiktok';
import { PKCE } from '@/lib/tiktok/request/constants';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scope = searchParams.get('scope') || 'user.info.basic,video.list';
    const state = searchParams.get('state') || '';

    const { codeVerifier, codeChallenge } = await PKCE.generatePair();

    const auth = new Authentication({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      graph_version: 'v2',
    });

    const redirectUri = process.env.TIKTOK_REDIRECT_URI || 
      `${request.nextUrl.origin}/tiktok`;
    
    const authUrl = auth.getAuthenticationUrl(redirectUri, scope, state, codeChallenge);

    const response = NextResponse.redirect(authUrl);

    response.cookies.set('tiktok_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Error in auth authorize:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

