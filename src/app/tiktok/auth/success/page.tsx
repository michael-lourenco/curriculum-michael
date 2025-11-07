'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const scope = searchParams.get('scope');

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
              Você foi autenticado com sucesso no TikTok. Agora você pode usar os recursos da API do TikTok.
            </p>

            {scope && (
              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Escopos autorizados:
                </p>
                <p className="text-sm text-gray-600">
                  <code className="bg-gray-200 px-2 py-1 rounded">{scope}</code>
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
              </ul>
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

