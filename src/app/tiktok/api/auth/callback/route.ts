import { NextRequest, NextResponse } from 'next/server';
import { Authentication } from '@/lib/tiktok';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.json(
        { error: 'Authorization failed', error_description: error },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code not provided' },
        { status: 400 }
      );
    }

    const codeVerifier = request.cookies.get('tiktok_code_verifier')?.value;

    if (!codeVerifier) {
      return NextResponse.json(
        { error: 'Code verifier not found. Please restart the authorization process.' },
        { status: 400 }
      );
    }

    const auth = new Authentication({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      graph_version: 'v2',
    });

    const redirectUri = process.env.TIKTOK_REDIRECT_URI || 
      `${request.nextUrl.origin}/tiktok`;
    
    const tokenResponse = await auth.getAccessTokenFromCode(code, redirectUri, codeVerifier);

    if (tokenResponse.error) {
      const errorResponse = NextResponse.json(
        { error: 'Failed to get access token', details: tokenResponse.error },
        { status: 400 }
      );
      errorResponse.cookies.delete('tiktok_code_verifier');
      return errorResponse;
    }

    const response = NextResponse.json({
      success: true,
      access_token: tokenResponse.data?.access_token,
      refresh_token: tokenResponse.data?.refresh_token,
      expires_in: tokenResponse.data?.expires_in,
      token_type: tokenResponse.data?.token_type,
      scope: tokenResponse.data?.scope,
      state,
    });

    response.cookies.delete('tiktok_code_verifier');

    return response;
  } catch (error: any) {
    console.error('Error in auth callback:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

