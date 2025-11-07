import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/tiktok';

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
          error: 'Access token required',
          message: 'Você precisa autenticar primeiro. Acesse /tiktok/api/auth/authorize para obter um token de acesso.',
          hint: 'O token pode ser fornecido via: 1) Header Authorization: Bearer <token>, 2) Query parameter: ?access_token=<token>, ou 3) Cookie tiktok_access_token (salvo após autenticação)'
        },
        { status: 401 }
      );
    }

    const user = new User({
      access_token: accessToken,
      graph_version: 'v2',
    });

    const searchParams = request.nextUrl.searchParams;
    const fieldsParam = searchParams.get('fields');
    const fields = fieldsParam ? fieldsParam.split(',').map(f => f.trim()).filter(f => f) : [];

    // Log para debug
    console.log('Fetching user info with token:', accessToken ? `${accessToken.substring(0, 10)}...` : 'NOT FOUND');
    console.log('Fields requested:', fields);

    // Se não houver campos especificados, não passar parâmetro fields
    // Isso fará a API retornar os campos básicos por padrão
    const params: Record<string, any> = {};
    if (fields.length > 0) {
      params.fields = fields.join(',');
    }
    // Se não houver campos, deixar vazio para pegar campos padrão do user.info.basic

    console.log('Calling user.getSelf with params:', params);
    const userInfo = await user.getSelf(params);

    // Log da resposta para debug
    console.log('User info response:', JSON.stringify(userInfo, null, 2));

    if (userInfo.error) {
      console.error('Error from TikTok API:', userInfo.error);
      return NextResponse.json(
        { 
          error: 'Failed to get user info', 
          details: userInfo.error,
          message: userInfo.error.message || 'Erro ao obter informações do usuário do TikTok',
          code: userInfo.error.code,
          log_id: userInfo.error.log_id,
        },
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

