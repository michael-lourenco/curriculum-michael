import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/tiktok';

// Esta rota é dinâmica porque usa headers, cookies e searchParams
export const dynamic = 'force-dynamic';

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
    
    // Se não houver campos especificados, usar os mesmos campos da validação que funcionam
    // Isso garante que obtemos as informações básicas disponíveis com user.info.basic
    const defaultFields = 'open_id,display_name,union_id,avatar_url';
    const fields = fieldsParam ? fieldsParam.split(',').map(f => f.trim()).filter(f => f) : defaultFields.split(',');
    
    // Log para debug
    console.log('Fetching user info with token:', accessToken ? `${accessToken.substring(0, 15)}...` : 'NOT FOUND');
    console.log('Fields requested:', fields);

    // Sempre passar os campos - usar os mesmos que funcionam na validação
    const params: Record<string, any> = {
      fields: fields.join(',')
    };

    console.log('Calling user.getSelf with params:', params);
    const userInfo = await user.getSelf(params);

    // Log da resposta para debug
    console.log('User info response:', JSON.stringify(userInfo, null, 2));

    // A API do TikTok pode retornar error.code === "ok" que significa sucesso, não erro
    // Verificar se realmente é um erro (error existe E code não é "ok")
    if (userInfo.error && userInfo.error.code !== 'ok') {
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

    // Extrair informações do usuário usando a mesma lógica da validação
    const userData = userInfo.data?.user || userInfo.data || {};
    
    // Retornar no mesmo formato da validação para consistência
    return NextResponse.json({
      valid: true,
      user_info: userData,
      available_fields: Object.keys(userData),
      data: userInfo.data, // Manter compatibilidade com formato original
    });
  } catch (error: any) {
    console.error('Error getting user info:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

