import { NextRequest, NextResponse } from 'next/server';
import { Authentication } from '@/lib/tiktok';
import { PKCE } from '@/lib/tiktok/request/constants';

// Esta rota é dinâmica porque usa searchParams e cookies
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Por padrão, usar apenas user.info.basic que é o escopo mais básico
    // Você pode adicionar mais escopos separados por vírgula: user.info.basic,video.list
    let scope = searchParams.get('scope') || 'user.info.basic';
    
    // Limpar e normalizar escopos: remover espaços extras e garantir formato correto
    scope = scope
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .join(',');
    
    const state = searchParams.get('state') || '';

    const { codeVerifier, codeChallenge } = await PKCE.generatePair();

    const auth = new Authentication({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      graph_version: 'v2',
    });

    // Usar a variável de ambiente se configurada
    // IMPORTANTE: Se você tem /tiktok cadastrado no TikTok for Developers,
    // configure TIKTOK_REDIRECT_URI=https://michaellourenco.com/tiktok no .env
    // Caso contrário, usa /tiktok/api/auth/callback como padrão
    const redirectUri = process.env.TIKTOK_REDIRECT_URI 
      ? process.env.TIKTOK_REDIRECT_URI.replace('{origin}', request.nextUrl.origin)
      : `${request.nextUrl.origin}/tiktok/api/auth/callback`;
    
    // Log para diagnóstico dos escopos solicitados
    console.log('=== AUTHORIZATION REQUEST DEBUG ===');
    console.log('Scopes requested:', scope);
    console.log('Scopes type:', typeof scope);
    console.log('Scopes split:', scope.split(','));
    console.log('Redirect URI:', redirectUri);
    
    const authUrl = auth.getAuthenticationUrl(redirectUri, scope, state, codeChallenge);
    
    // Log da URL gerada para verificar formato
    console.log('Generated auth URL:', authUrl);
    console.log('URL contains scopes:', authUrl.includes('scope='));

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

