'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const scope = searchParams.get('scope');
  const authenticated = searchParams.get('authenticated');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Autenticação Bem-Sucedida!
              </h1>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg text-gray-700 mb-4">
              Você foi autenticado com sucesso no TikTok. O token de acesso foi salvo com segurança em um cookie HTTP-only.
            </p>
            
            {authenticated === 'true' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  <strong>✓ Token salvo com sucesso!</strong> Você pode agora acessar as informações do usuário e outros recursos da API.
                </p>
              </div>
            )}

            {scope && scope !== 'none' ? (
              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Escopos retornados pelo TikTok:
                </p>
                <div className="space-y-2">
                  {scope.split(',').map((s, idx) => {
                    const scopeName = s.trim();
                    const isUpload = scopeName.includes('video.upload');
                    const isPublish = scopeName.includes('video.publish');
                    const isImportant = isUpload || isPublish;
                    
                    return (
                      <div
                        key={idx}
                        className={`flex items-center p-2 rounded ${
                          isImportant ? 'bg-green-100 border border-green-300' : 'bg-white border border-gray-200'
                        }`}
                      >
                        {isImportant && (
                          <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <code className={`text-sm ${isImportant ? 'text-green-800 font-semibold' : 'text-gray-700'}`}>
                          {scopeName}
                        </code>
                        {isImportant && (
                          <span className="ml-2 text-xs text-green-700 font-medium">
                            (Upload/Publish)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Verificar escopos esperados */}
                {(!scope.includes('video.upload') || !scope.includes('video.publish')) && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
                    <p className="text-sm font-semibold text-yellow-800 mb-2">
                      ⚠️ Escopos de Upload/Publish não encontrados
                    </p>
                    <p className="text-xs text-yellow-700 mb-2">
                      Os escopos <code className="bg-yellow-100 px-1 rounded">video.upload</code> e <code className="bg-yellow-100 px-1 rounded">video.publish</code> não foram retornados pelo TikTok.
                    </p>
                    <p className="text-xs text-yellow-700">
                      Isso pode indicar limitações do ambiente Sandbox ou que os escopos não foram aprovados. Verifique os logs do servidor e o painel do TikTok for Developers.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 p-4 bg-red-50 rounded border border-red-200">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  ⚠️ Nenhum escopo retornado
                </p>
                <p className="text-xs text-red-700">
                  O TikTok não retornou nenhum escopo na resposta do token. Verifique os logs do servidor para mais detalhes.
                </p>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Próximos passos:</strong>
              </p>
              <ul className="mt-2 space-y-2 text-sm text-blue-700 list-disc list-inside">
                <li>Você pode agora acessar informações do usuário</li>
                <li>Listar vídeos do usuário autenticado</li>
                <li>Utilizar outras funcionalidades da API do TikTok</li>
                {scope && (scope.includes('video.upload') || scope.includes('video.publish')) && (
                  <li className="font-semibold text-green-700">✓ Upload e publicação de vídeos disponíveis</li>
                )}
              </ul>
            </div>
            
            <div className="mt-4 p-4 bg-purple-50 rounded border border-purple-200">
              <p className="text-sm font-semibold text-purple-800 mb-2">
                🔍 Ferramentas de Diagnóstico
              </p>
              <div className="space-y-2 text-sm text-purple-700">
                <Link
                  href="/tiktok/api/auth/debug"
                  className="block text-purple-600 hover:text-purple-800 underline"
                  target="_blank"
                >
                  Ver informações detalhadas do token e escopos
                </Link>
                <Link
                  href="/tiktok/validate"
                  className="block text-purple-600 hover:text-purple-800 underline"
                >
                  Validar token e verificar escopos disponíveis
                </Link>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/tiktok"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
            >
              Voltar para a página inicial
            </Link>
            <a
              href="/tiktok/user-info"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
            >
              Ver informações do usuário
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}

