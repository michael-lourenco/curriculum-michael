'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const errorType = searchParams.get('error_type');
  const errorCode = searchParams.get('error_code');

  const getErrorMessage = () => {
    if (error === 'invalid_scope') {
      return {
        title: 'Escopo Inválido',
        description: 'Os escopos solicitados não estão habilitados no seu app do TikTok for Developers.',
        solution: (
          <div className="mt-4 space-y-3">
            <p className="text-gray-700">
              <strong>Para corrigir este problema:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Acesse o <a href="https://developers.tiktok.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">TikTok for Developers</a></li>
              <li>Selecione seu app</li>
              <li>Vá até a seção <strong>"Products"</strong> ou <strong>"Scopes"</strong></li>
              <li>Habilite os seguintes escopos:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">user.info.basic</code> - Para informações básicas do usuário</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">video.list</code> - Para listar vídeos</li>
                </ul>
              </li>
              <li>Salve as alterações</li>
              <li>Tente novamente a autenticação</li>
            </ol>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Se você está usando um app em modo de teste (sandbox), certifique-se de que os escopos estão habilitados. 
                Alguns escopos podem estar disponíveis apenas após a aprovação do app.
              </p>
            </div>
          </div>
        ),
      };
    }

    if (error === 'no_code') {
      return {
        title: 'Código de Autorização Não Fornecido',
        description: 'O TikTok não retornou um código de autorização válido.',
        solution: (
          <p className="text-gray-700 mt-4">
            Por favor, tente novamente o processo de autenticação. Se o problema persistir, verifique se o redirect URI está configurado corretamente no TikTok for Developers.
          </p>
        ),
      };
    }

    if (error === 'no_code_verifier') {
      return {
        title: 'Erro na Verificação PKCE',
        description: 'Não foi possível verificar a autenticação devido a um problema com o código de verificação.',
        solution: (
          <p className="text-gray-700 mt-4">
            Por favor, reinicie o processo de autenticação. O código de verificação pode ter expirado ou não foi armazenado corretamente.
          </p>
        ),
      };
    }

    if (error === 'token_error') {
      return {
        title: 'Erro ao Obter Token',
        description: errorDescription || 'Não foi possível obter o token de acesso do TikTok.',
        solution: (
          <div className="mt-4 space-y-3">
            <p className="text-gray-700">
              Possíveis causas:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>O código de autorização pode ter expirado</li>
              <li>O redirect URI pode não corresponder ao configurado no app</li>
              <li>As credenciais do app (CLIENT_KEY e CLIENT_SECRET) podem estar incorretas</li>
              <li>O código de verificação PKCE pode estar incorreto</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Tente iniciar o processo de autenticação novamente.
            </p>
          </div>
        ),
      };
    }

    return {
      title: 'Erro de Autenticação',
      description: errorDescription || 'Ocorreu um erro durante o processo de autenticação.',
      solution: (
        <p className="text-gray-700 mt-4">
          Por favor, tente novamente. Se o problema persistir, verifique as configurações do app no TikTok for Developers.
        </p>
      ),
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {errorInfo.title}
              </h1>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg text-gray-700 mb-4">
              {errorInfo.description}
            </p>
            
            {errorInfo.solution}

            {(errorType || errorCode) && (
              <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Detalhes técnicos:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {error && <li><code className="bg-gray-200 px-2 py-1 rounded">error: {error}</code></li>}
                  {errorType && <li><code className="bg-gray-200 px-2 py-1 rounded">error_type: {errorType}</code></li>}
                  {errorCode && <li><code className="bg-gray-200 px-2 py-1 rounded">error_code: {errorCode}</code></li>}
                  {errorDescription && <li><code className="bg-gray-200 px-2 py-1 rounded">error_description: {errorDescription}</code></li>}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Link
              href="/tiktok"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
            >
              Voltar para a página inicial
            </Link>
            <a
              href="/tiktok/api/auth/authorize"
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition"
            >
              Tentar novamente
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Documentação Útil
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://developers.tiktok.com/doc/login-kit-web" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Documentação do Login Kit - TikTok for Developers
                </a>
              </li>
              <li>
                <a 
                  href="https://developers.tiktok.com/doc/tiktok-api-scopes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Documentação de Escopos - TikTok API
                </a>
              </li>
              <li>
                <a 
                  href="https://developers.tiktok.com/apps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Gerenciar seu App - TikTok for Developers
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}

