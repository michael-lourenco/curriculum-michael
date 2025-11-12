import { NextRequest, NextResponse } from 'next/server';
import { Authentication } from '@/lib/tiktok';

// Esta rota é dinâmica porque usa searchParams e cookies
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const errorType = searchParams.get('error_type');

    // Se houver erro na autenticação, redirecionar para página de erro
    if (error) {
      const errorPageUrl = new URL('/tiktok/auth/error', request.nextUrl.origin);
      errorPageUrl.searchParams.set('error', error);
      if (errorDescription) {
        errorPageUrl.searchParams.set('error_description', errorDescription);
      }
      if (errorType) {
        errorPageUrl.searchParams.set('error_type', errorType);
      }
      return NextResponse.redirect(errorPageUrl.toString());
    }

    if (!code) {
      const errorPageUrl = new URL('/tiktok/auth/error', request.nextUrl.origin);
      errorPageUrl.searchParams.set('error', 'no_code');
      errorPageUrl.searchParams.set('error_description', 'Código de autorização não fornecido');
      return NextResponse.redirect(errorPageUrl.toString());
    }

    const codeVerifier = request.cookies.get('tiktok_code_verifier')?.value;

    if (!codeVerifier) {
      const errorPageUrl = new URL('/tiktok/auth/error', request.nextUrl.origin);
      errorPageUrl.searchParams.set('error', 'no_code_verifier');
      errorPageUrl.searchParams.set('error_description', 'Code verifier não encontrado. Por favor, reinicie o processo de autorização.');
      return NextResponse.redirect(errorPageUrl.toString());
    }

    const auth = new Authentication({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      graph_version: 'v2',
    });

    // O redirect URI deve corresponder exatamente ao usado na autorização
    // IMPORTANTE: Se TIKTOK_REDIRECT_URI estiver configurada, ela DEVE corresponder
    // exatamente ao usado na rota de autorização
    const redirectUri = process.env.TIKTOK_REDIRECT_URI 
      ? process.env.TIKTOK_REDIRECT_URI.replace('{origin}', request.nextUrl.origin)
      : `${request.nextUrl.origin}/tiktok/api/auth/callback`;
    
    const tokenResponse = await auth.getAccessTokenFromCode(code, redirectUri, codeVerifier);

    // Debug: log completo da resposta para diagnóstico
    console.log('=== TOKEN RESPONSE DEBUG ===');
    console.log('Full token response:', JSON.stringify(tokenResponse, null, 2));
    console.log('Response structure:', {
      hasData: !!tokenResponse.data,
      hasError: !!tokenResponse.error,
      dataKeys: tokenResponse.data ? Object.keys(tokenResponse.data) : [],
      errorKeys: tokenResponse.error ? Object.keys(tokenResponse.error) : [],
    });
    
    // Log específico dos escopos
    if (tokenResponse.data) {
      console.log('Token data details:', {
        access_token: tokenResponse.data.access_token ? `${tokenResponse.data.access_token.substring(0, 20)}...` : 'NOT FOUND',
        scope: tokenResponse.data.scope || 'NOT FOUND',
        expires_in: tokenResponse.data.expires_in || 'NOT FOUND',
        refresh_token: tokenResponse.data.refresh_token ? `${tokenResponse.data.refresh_token.substring(0, 20)}...` : 'NOT FOUND',
        token_type: tokenResponse.data.token_type || 'NOT FOUND',
        allDataKeys: Object.keys(tokenResponse.data),
      });
    }

    if (tokenResponse.error) {
      const errorPageUrl = new URL('/tiktok/auth/error', request.nextUrl.origin);
      errorPageUrl.searchParams.set('error', 'token_error');
      errorPageUrl.searchParams.set('error_description', 
        tokenResponse.error?.message || 
        'Falha ao obter token de acesso'
      );
      if (tokenResponse.error?.code) {
        errorPageUrl.searchParams.set('error_code', tokenResponse.error.code);
      }
      if (tokenResponse.error?.log_id) {
        errorPageUrl.searchParams.set('log_id', tokenResponse.error.log_id);
      }
      const errorResponse = NextResponse.redirect(errorPageUrl.toString());
      errorResponse.cookies.delete('tiktok_code_verifier');
      return errorResponse;
    }

    // Sucesso - redirecionar para página de sucesso
    // O token pode estar em diferentes lugares na resposta do TikTok
    // Formato 1: { data: { access_token: "..." } }
    // Formato 2: { access_token: "..." } (sem wrapper data)
    const accessToken = tokenResponse.data?.access_token || 
                       (tokenResponse as any).access_token ||
                       null;
    
    // Extrair escopos da resposta
    const scopes = tokenResponse.data?.scope || 
                   (tokenResponse as any).scope || 
                   null;
    
    // Log dos escopos para diagnóstico
    console.log('=== SCOPES ANALYSIS ===');
    console.log('Scopes returned by TikTok:', scopes);
    console.log('Scopes type:', typeof scopes);
    console.log('Scopes is array:', Array.isArray(scopes));
    
    const successPageUrl = new URL('/tiktok/auth/success', request.nextUrl.origin);
    
    // Não passar token na URL por segurança - ele já está no cookie
    // Mas podemos passar um indicador de sucesso
    if (accessToken) {
      // Token encontrado - não passar na URL por segurança, apenas no cookie
      successPageUrl.searchParams.set('authenticated', 'true');
    }
    
    // Passar escopos na URL para exibição (não sensível)
    if (scopes) {
      const scopesString = Array.isArray(scopes) ? scopes.join(',') : String(scopes);
      successPageUrl.searchParams.set('scope', scopesString);
      console.log('Scopes saved to URL:', scopesString);
    } else {
      console.warn('⚠️ ATENÇÃO: Nenhum escopo retornado na resposta do token!');
      successPageUrl.searchParams.set('scope', 'none');
    }

    const response = NextResponse.redirect(successPageUrl.toString());
    response.cookies.delete('tiktok_code_verifier');
    
    // Salvar o token em um cookie seguro
    if (accessToken) {
      response.cookies.set('tiktok_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokenResponse.data?.expires_in || 3600,
        path: '/',
      });
      console.log('Token salvo no cookie com sucesso');
    } else {
      console.warn('Token não encontrado na resposta:', tokenResponse);
    }
    
    // Salvar escopos em cookie separado para referência futura
    if (scopes) {
      const scopesString = Array.isArray(scopes) ? scopes.join(',') : String(scopes);
      response.cookies.set('tiktok_scopes', scopesString, {
        httpOnly: false, // Permitir acesso via JavaScript para diagnóstico
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokenResponse.data?.expires_in || 3600,
        path: '/',
      });
      console.log('Escopos salvos no cookie:', scopesString);
    } else {
      console.warn('⚠️ Nenhum escopo para salvar no cookie');
    }

    return response;
  } catch (error: any) {
    console.error('Error in auth callback:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

