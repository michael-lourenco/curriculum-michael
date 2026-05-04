import { NextRequest, NextResponse } from 'next/server';
import { Authentication } from '@/lib/tiktok';

// Esta rota é dinâmica porque usa headers, query params e body
export const dynamic = 'force-dynamic';

/**
 * Atualiza um access_token do TikTok usando o refresh_token
 * Pode receber o refresh_token via:
 * - Cookie: tiktok_refresh_token
 * - Header Authorization: Bearer <refresh_token>
 * - Query parameter: ?refresh_token=...
 * - Body JSON: { refresh_token: "..." }
 */
export async function POST(request: NextRequest) {
  try {
    let refreshToken = '';

    // Tentar obter refresh_token do body JSON
    try {
      const body = await request.json();
      refreshToken = body.refresh_token || '';
    } catch (e) {
      // Body não é JSON válido ou está vazio, continuar
    }

    // Tentar obter do header Authorization
    if (!refreshToken) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        refreshToken = authHeader.substring(7);
      }
    }

    // Tentar obter do query parameter
    if (!refreshToken) {
      const searchParams = request.nextUrl.searchParams;
      refreshToken = searchParams.get('refresh_token') || '';
    }

    // Tentar obter do cookie (salvo durante autenticação)
    if (!refreshToken) {
      refreshToken = request.cookies.get('tiktok_refresh_token')?.value || '';
    }

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Refresh token required',
          message: 'Refresh token não fornecido. Pode ser fornecido via: 1) Cookie tiktok_refresh_token, 2) Header Authorization: Bearer <refresh_token>, 3) Query parameter: ?refresh_token=<token>, ou 4) Body JSON: { "refresh_token": "<token>" }',
        },
        { status: 400 }
      );
    }

    // Validar formato básico do token
    // Refresh tokens do TikTok também começam com "act." ou podem ter formato diferente
    const tokenFormatValid = refreshToken.length > 20;
    
    if (!tokenFormatValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token format',
          message: 'O refresh token não está no formato esperado.',
          token_preview: `${refreshToken.substring(0, 10)}...${refreshToken.substring(refreshToken.length - 5)}`,
        },
        { status: 400 }
      );
    }

    // Criar instância de Authentication
    const auth = new Authentication({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      graph_version: 'v2',
    });

    console.log('Refreshing token:', `${refreshToken.substring(0, 15)}...`);

    // Chamar método de refresh
    const refreshResponse = await auth.getRefreshAccessToken(refreshToken);

    console.log('Refresh response:', JSON.stringify(refreshResponse, null, 2));

    // Verificar se houve erro
    if (refreshResponse.error) {
      return NextResponse.json(
        {
          success: false,
          error: refreshResponse.error.code || 'Refresh failed',
          message: refreshResponse.error.message || 'Falha ao atualizar token',
          log_id: refreshResponse.error.log_id,
          debug: refreshResponse.debug,
        },
        { status: 400 }
      );
    }

    // Extrair novos tokens da resposta
    const newAccessToken = refreshResponse.data?.access_token || 
                          (refreshResponse as any).access_token || 
                          null;
    
    const newRefreshToken = refreshResponse.data?.refresh_token || 
                            (refreshResponse as any).refresh_token || 
                            null;

    const expiresIn = refreshResponse.data?.expires_in || 3600;
    const scopes = refreshResponse.data?.scope || 
                   (refreshResponse as any).scope || 
                   null;

    if (!newAccessToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'No access token in response',
          message: 'A resposta não contém um novo access token',
          debug: refreshResponse.debug,
        },
        { status: 500 }
      );
    }

    // Preparar resposta
    const response = NextResponse.json({
      success: true,
      message: 'Token atualizado com sucesso',
      data: {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
        scope: scopes,
        token_type: refreshResponse.data?.token_type || 'Bearer',
      },
      token_preview: {
        access_token: `${newAccessToken.substring(0, 15)}...${newAccessToken.substring(newAccessToken.length - 5)}`,
        refresh_token: newRefreshToken ? `${newRefreshToken.substring(0, 15)}...${newRefreshToken.substring(newRefreshToken.length - 5)}` : null,
      },
    });

    // Salvar novo access_token em cookie
    response.cookies.set('tiktok_access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
      path: '/',
    });

    // Salvar novo refresh_token em cookie (se fornecido)
    if (newRefreshToken) {
      response.cookies.set('tiktok_refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: expiresIn * 24 * 30, // Refresh tokens geralmente duram mais (30 dias)
        path: '/',
      });
      console.log('Novo refresh token salvo no cookie');
    } else {
      // Se não houver novo refresh_token, manter o antigo
      console.warn('⚠️ Nenhum novo refresh_token retornado. Mantendo o token anterior.');
    }

    // Atualizar escopos no cookie se fornecidos
    if (scopes) {
      const scopesString = Array.isArray(scopes) ? scopes.join(',') : String(scopes);
      response.cookies.set('tiktok_scopes', scopesString, {
        httpOnly: false, // Permitir acesso via JavaScript para diagnóstico
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: expiresIn,
        path: '/',
      });
      console.log('Escopos atualizados no cookie:', scopesString);
    }

    console.log('Token atualizado com sucesso');
    return response;

  } catch (error: any) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Refresh error',
        message: error.message || 'Erro ao atualizar token',
      },
      { status: 500 }
    );
  }
}

/**
 * Também suporta GET para facilitar testes
 */
export async function GET(request: NextRequest) {
  // Redirecionar para POST ou retornar instruções
  return NextResponse.json(
    {
      message: 'Use POST para atualizar o token',
      methods: {
        cookie: 'O refresh_token deve estar no cookie tiktok_refresh_token',
        header: 'Authorization: Bearer <refresh_token>',
        query: '?refresh_token=<token>',
        body: '{ "refresh_token": "<token>" }',
      },
    },
    { status: 405 }
  );
}

