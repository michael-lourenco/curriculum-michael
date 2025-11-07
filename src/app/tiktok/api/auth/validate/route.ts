import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/tiktok';

// Esta rota é dinâmica porque usa headers e query params
export const dynamic = 'force-dynamic';

/**
 * Valida um access_token do TikTok
 * Pode receber o token via:
 * - Query parameter: ?access_token=...
 * - Header Authorization: Bearer <token>
 * - Cookie: tiktok_access_token
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    let accessToken = '';

    // Tentar obter token do header Authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    } 
    // Tentar obter token do query parameter
    else {
      const searchParams = request.nextUrl.searchParams;
      accessToken = searchParams.get('access_token') || '';
    }
    
    // Tentar obter token do cookie (salvo durante autenticação)
    if (!accessToken) {
      accessToken = request.cookies.get('tiktok_access_token')?.value || '';
    }

    if (!accessToken) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'Access token required',
          message: 'Token não fornecido. Pode ser fornecido via: 1) Header Authorization: Bearer <token>, 2) Query parameter: ?access_token=<token>, ou 3) Cookie tiktok_access_token'
        },
        { status: 400 }
      );
    }

    // Validar formato básico do token
    const tokenFormatValid = accessToken.startsWith('act.') && accessToken.length > 20;
    
    if (!tokenFormatValid) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Invalid token format',
          message: 'O token não está no formato esperado. Tokens do TikTok geralmente começam com "act."',
          token_preview: `${accessToken.substring(0, 10)}...${accessToken.substring(accessToken.length - 5)}`,
        },
        { status: 400 }
      );
    }

    // Tentar fazer uma requisição básica para validar o token
    const user = new User({
      access_token: accessToken,
      graph_version: 'v2',
    });

    // Fazer uma requisição para obter informações básicas do usuário
    // Isso validará se o token é válido e está ativo
    console.log('Validating token:', `${accessToken.substring(0, 15)}...`);
    
    // Tentar obter campos básicos disponíveis com user.info.basic
    // Se o token tiver escopos adicionais, alguns campos podem não estar disponíveis
    const userInfo = await user.getSelf({ fields: 'open_id,display_name,union_id,avatar_url' });

    console.log('Validation response:', JSON.stringify(userInfo, null, 2));

    // Verificar se a resposta indica erro real (não apenas error.code === "ok")
    if (userInfo.error && userInfo.error.code !== 'ok') {
      return NextResponse.json(
        {
          valid: false,
          error: userInfo.error.code || 'Token validation failed',
          message: userInfo.error.message || 'Token inválido ou expirado',
          log_id: userInfo.error.log_id,
          debug: userInfo.debug,
        },
        { status: 200 } // Retornar 200 porque a validação funcionou, só o token é inválido
      );
    }

    // Extrair informações do usuário
    const userData = userInfo.data?.user || userInfo.data || {};
    
    // Determinar escopos disponíveis baseado nos campos retornados
    const availableFields = Object.keys(userData);
    let inferredScopes = 'user.info.basic'; // Sempre presente
    if (userData.bio_description || userData.avatar_url) {
      inferredScopes += ', user.info.profile';
    }
    if (userData.follower_count || userData.following_count || userData.likes_count || userData.video_count) {
      inferredScopes += ', user.info.stats';
    }

    // Token é válido se chegou aqui
    return NextResponse.json({
      valid: true,
      message: 'Token válido e ativo',
      token_preview: `${accessToken.substring(0, 15)}...${accessToken.substring(accessToken.length - 5)}`,
      user_info: userData,
      available_fields: availableFields,
      inferred_scopes: inferredScopes,
      note: 'Scopes e expires_in só estão disponíveis na resposta inicial do token. Estes são escopos inferidos baseados nos campos disponíveis.',
      debug: userInfo.debug,
    });

  } catch (error: any) {
    console.error('Error validating token:', error);
    return NextResponse.json(
      { 
        valid: false,
        error: 'Validation error',
        message: error.message || 'Erro ao validar token',
      },
      { status: 500 }
    );
  }
}

