import { NextRequest, NextResponse } from 'next/server';

// Esta rota é dinâmica porque usa cookies
export const dynamic = 'force-dynamic';

/**
 * Endpoint de diagnóstico para inspecionar informações do token e escopos
 * Útil para debug e verificação de configuração
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('tiktok_access_token')?.value || '';
    const scopesFromCookie = request.cookies.get('tiktok_scopes')?.value || '';

    // Escopos esperados baseados na implementação
    const expectedScopes = [
      'user.info.basic',
      'user.info.profile',
      'user.info.stats',
      'video.upload',
      'video.publish',
    ];

    // Escopos solicitados (pode ser obtido da URL de autorização se necessário)
    const requestedScopes = request.nextUrl.searchParams.get('requested_scopes')?.split(',') || [];

    const debugInfo = {
      timestamp: new Date().toISOString(),
      token: {
        exists: !!accessToken,
        preview: accessToken ? `${accessToken.substring(0, 20)}...${accessToken.substring(accessToken.length - 10)}` : null,
        length: accessToken.length,
        format_valid: accessToken.startsWith('act.'),
      },
      scopes: {
        from_cookie: scopesFromCookie,
        from_cookie_array: scopesFromCookie ? scopesFromCookie.split(',') : [],
        expected: expectedScopes,
        requested: requestedScopes.length > 0 ? requestedScopes : expectedScopes,
        missing: [] as string[],
        extra: [] as string[],
      },
      analysis: {
        has_upload_scope: scopesFromCookie.includes('video.upload'),
        has_publish_scope: scopesFromCookie.includes('video.publish'),
        has_basic_scopes: scopesFromCookie.includes('user.info.basic'),
        scope_count: scopesFromCookie ? scopesFromCookie.split(',').length : 0,
      },
      cookies: {
        tiktok_access_token: !!accessToken,
        tiktok_scopes: !!scopesFromCookie,
        all_cookies: Object.keys(request.cookies.getAll().reduce((acc, cookie) => {
          acc[cookie.name] = cookie.name;
          return acc;
        }, {} as Record<string, string>)),
      },
    };

    // Análise de escopos faltantes
    if (scopesFromCookie) {
      const returnedScopes = scopesFromCookie.split(',').map(s => s.trim());
      debugInfo.scopes.missing = expectedScopes.filter(scope => !returnedScopes.includes(scope));
      debugInfo.scopes.extra = returnedScopes.filter(scope => !expectedScopes.includes(scope));
    } else {
      debugInfo.scopes.missing = expectedScopes;
    }

    return NextResponse.json({
      success: true,
      message: 'Informações de diagnóstico do token TikTok',
      debug: debugInfo,
      recommendations: generateRecommendations(debugInfo),
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error: any) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao gerar informações de diagnóstico',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

function generateRecommendations(debugInfo: any): string[] {
  const recommendations: string[] = [];

  if (!debugInfo.token.exists) {
    recommendations.push('❌ Nenhum token encontrado. Você precisa autenticar primeiro em /tiktok/api/auth/authorize');
    return recommendations;
  }

  if (!debugInfo.scopes.from_cookie) {
    recommendations.push('⚠️ Nenhum escopo foi retornado pelo TikTok na resposta do token');
    recommendations.push('💡 Isso pode indicar que os escopos não foram aprovados ou há limitação do Sandbox');
    recommendations.push('💡 Verifique os logs do servidor durante a autenticação para ver a resposta completa');
  }

  if (debugInfo.scopes.missing.length > 0) {
    recommendations.push(`⚠️ Escopos faltantes: ${debugInfo.scopes.missing.join(', ')}`);
    recommendations.push('💡 Verifique se esses escopos estão habilitados no painel do TikTok for Developers');
    recommendations.push('💡 Alguns escopos podem não estar disponíveis no ambiente Sandbox');
  }

  if (!debugInfo.analysis.has_upload_scope) {
    recommendations.push('❌ Escopo video.upload não encontrado - necessário para upload de vídeos');
    recommendations.push('💡 Verifique se o produto "Content Posting API" está adicionado ao app');
    recommendations.push('💡 Verifique se o escopo está aprovado no painel do desenvolvedor');
  }

  if (!debugInfo.analysis.has_publish_scope) {
    recommendations.push('❌ Escopo video.publish não encontrado - necessário para publicação de vídeos');
    recommendations.push('💡 Verifique se o produto "Content Posting API" está adicionado ao app');
    recommendations.push('💡 Verifique se o escopo está aprovado no painel do desenvolvedor');
  }

  if (debugInfo.analysis.has_upload_scope && debugInfo.analysis.has_publish_scope) {
    recommendations.push('✅ Todos os escopos necessários para upload estão presentes!');
  }

  if (debugInfo.scopes.extra.length > 0) {
    recommendations.push(`ℹ️ Escopos adicionais retornados: ${debugInfo.scopes.extra.join(', ')}`);
  }

  return recommendations;
}

