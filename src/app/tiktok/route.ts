import { NextRequest, NextResponse } from 'next/server';
import { Authentication } from '@/lib/tiktok';

/**
 * Esta rota processa o callback do TikTok quando o redirect URI é /tiktok
 * Ela verifica se há parâmetros de callback (code ou error)
 * Se houver, processa o callback. Caso contrário, redireciona para a página principal
 */

// Esta rota é dinâmica porque usa searchParams e cookies
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Se houver parâmetros de callback (code ou error), processa o callback
  if (code || error) {
    return handleCallback(request, searchParams);
  }

  // Se não for callback, fazer um redirect temporário (307) para /tiktok/home
  // onde está a página principal. Isso mantém a URL limpa para o usuário final.
  return NextResponse.redirect(new URL('/tiktok/home', request.nextUrl.origin), 307);
}

async function handleCallback(request: NextRequest, searchParams: URLSearchParams) {
  try {
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

    const redirectUri = process.env.TIKTOK_REDIRECT_URI || 
      `${request.nextUrl.origin}/tiktok`;
    
    const tokenResponse = await auth.getAccessTokenFromCode(code, redirectUri, codeVerifier);

    // Debug: log da resposta para verificar estrutura
    console.log('Token response structure:', JSON.stringify(tokenResponse, null, 2));

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
    
    const successPageUrl = new URL('/tiktok/auth/success', request.nextUrl.origin);
    
    // Não passar token na URL por segurança - ele já está no cookie
    // Mas podemos passar um indicador de sucesso
    if (accessToken) {
      // Token encontrado - não passar na URL por segurança, apenas no cookie
      successPageUrl.searchParams.set('authenticated', 'true');
    }
    
    if (tokenResponse.data?.scope) {
      successPageUrl.searchParams.set('scope', tokenResponse.data.scope);
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

    return response;
  } catch (error: any) {
    console.error('Error in TikTok callback:', error);
    const errorPageUrl = new URL('/tiktok/auth/error', request.nextUrl.origin);
    errorPageUrl.searchParams.set('error', 'internal_error');
    errorPageUrl.searchParams.set('error_description', error.message || 'Erro interno do servidor');
    return NextResponse.redirect(errorPageUrl.toString());
  }
}

