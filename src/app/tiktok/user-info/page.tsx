'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserInfo {
  display_name?: string;
  open_id?: string;
  union_id?: string;
  avatar_url?: string;
  bio_description?: string;
  follower_count?: number;
  following_count?: number;
  likes_count?: number;
  video_count?: number;
}

export default function UserInfoPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  async function fetchUserInfo() {
    try {
      setLoading(true);
      setError(null);
      setRawResponse(null);
      setAvailableFields([]);

      const response = await fetch('/tiktok/api/user/info', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setRawResponse(data);

      if (!response.ok) {
        const message = data.message || data.error || `Erro ${response.status}: ${response.statusText}`;
        const details = data.details ? `\n\nDetalhes: ${JSON.stringify(data.details, null, 2)}` : '';
        throw new Error(`${message}${details}`);
      }

      if (data.error && data.error.code !== 'ok') {
        const details = data.details ? `\n\nDetalhes: ${JSON.stringify(data.details, null, 2)}` : '';
        throw new Error(`${data.error.message || data.error || 'Erro ao buscar informações do usuário'}${details}`);
      }

      const userData = data.user_info || data.data?.user || data.data || data;
      setUserInfo(userData);
      setAvailableFields(data.available_fields || Object.keys(userData));
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar informações do usuário');
      console.error('Error fetching user info:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Informações do Usuário
            </h1>
            <Link
              href="/tiktok/home"
              className="text-blue-600 hover:underline"
            >
              Voltar
            </Link>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Carregando informações do usuário...</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">Erro</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <pre className="whitespace-pre-wrap break-words">{error}</pre>
                  </div>
                  <div className="mt-4 space-x-4">
                    <Link
                      href="/tiktok/api/auth/authorize?scope=user.info.basic"
                      className="text-sm font-medium text-red-800 hover:text-red-600 underline"
                    >
                      Autenticar novamente
                    </Link>
                    <button
                      onClick={fetchUserInfo}
                      className="text-sm font-medium text-red-800 hover:text-red-600 underline"
                    >
                      Tentar novamente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {userInfo && !loading && !error && (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  <strong>✓ Sucesso!</strong> A conexão com a API do TikTok está funcionando!
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                  {userInfo.avatar_url && (
                    <img
                      src={userInfo.avatar_url}
                      alt="Avatar"
                      className="h-24 w-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                    />
                  )}
                  <div className="flex-1">
                    {userInfo.display_name ? (
                      <>
                        <h3 className="text-sm font-medium text-gray-500">Nome de Exibição</h3>
                        <p className="mt-1 text-3xl font-bold text-gray-900">{userInfo.display_name}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">Nome não disponível</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userInfo.open_id && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Open ID</h3>
                      <p className="text-sm text-gray-700 font-mono break-all bg-gray-50 p-3 rounded border">
                        {userInfo.open_id}
                      </p>
                    </div>
                  )}

                  {userInfo.union_id && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Union ID</h3>
                      <p className="text-sm text-gray-700 font-mono break-all bg-gray-50 p-3 rounded border">
                        {userInfo.union_id}
                      </p>
                    </div>
                  )}
                </div>

                {userInfo.bio_description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Biografia</h3>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded border">{userInfo.bio_description}</p>
                  </div>
                )}

                {(userInfo.follower_count !== undefined ||
                  userInfo.following_count !== undefined ||
                  userInfo.likes_count !== undefined ||
                  userInfo.video_count !== undefined) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Estatísticas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {userInfo.follower_count !== undefined && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-600 font-medium">Seguidores</p>
                          <p className="text-2xl font-bold text-blue-900 mt-1">
                            {userInfo.follower_count.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      )}
                      {userInfo.following_count !== undefined && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-xs text-green-600 font-medium">Seguindo</p>
                          <p className="text-2xl font-bold text-green-900 mt-1">
                            {userInfo.following_count.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      )}
                      {userInfo.likes_count !== undefined && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <p className="text-xs text-red-600 font-medium">Curtidas</p>
                          <p className="text-2xl font-bold text-red-900 mt-1">
                            {userInfo.likes_count.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      )}
                      {userInfo.video_count !== undefined && (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-xs text-purple-600 font-medium">Vídeos</p>
                          <p className="text-2xl font-bold text-purple-900 mt-1">
                            {userInfo.video_count.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {availableFields.length > 0 && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Campos disponíveis</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableFields.map((field) => (
                      <span
                        key={field}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <details className="p-4 bg-gray-50 border border-gray-200 rounded">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  Ver resposta completa (debug)
                </summary>
                <pre className="mt-2 p-4 bg-white rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(rawResponse ?? userInfo, null, 2)}
                </pre>
              </details>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Informação:</strong> Com o escopo <code className="bg-blue-100 px-1 rounded">user.info.basic</code>, 
                  apenas informações básicas estão disponíveis. Para acessar mais informações (bio, estatísticas, etc.), 
                  autentique também com <code className="bg-blue-100 px-1 rounded">user.info.profile</code> e <code className="bg-blue-100 px-1 rounded">user.info.stats</code>.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4 flex-wrap">
                <button
                  onClick={fetchUserInfo}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
                >
                  Atualizar Informações
                </button>
                <Link
                  href="/tiktok/api/auth/validate"
                  target="_blank"
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
                >
                  Validar Token
                </Link>
                <Link
                  href="/tiktok/home"
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 transition"
                >
                  Voltar para Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

