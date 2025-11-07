'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserInfo {
  display_name?: string;
  bio_description?: string;
  avatar_url?: string;
  follower_count?: number;
  following_count?: number;
  likes_count?: number;
  video_count?: number;
}

export default function UserInfoPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  async function fetchUserInfo() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/tiktok/api/user/info?fields=display_name,bio_description,avatar_url,follower_count,following_count,likes_count,video_count', {
        credentials: 'include', // Importante: incluir cookies na requisição
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        const errorMessage = errorData.message || errorData.error || `Erro ${response.status}: ${response.statusText}`;
        const errorDetails = errorData.details ? JSON.stringify(errorData.details, null, 2) : '';
        throw new Error(`${errorMessage}${errorDetails ? `\n\nDetalhes: ${errorDetails}` : ''}`);
      }

      const data = await response.json();
      
      if (data.error) {
        const errorDetails = data.details ? JSON.stringify(data.details, null, 2) : '';
        throw new Error(`${data.error.message || data.error || 'Erro ao buscar informações do usuário'}${errorDetails ? `\n\nDetalhes: ${errorDetails}` : ''}`);
      }

      setUserInfo(data.data?.user || data.data || null);
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
              {userInfo.avatar_url && (
                <div className="flex justify-center">
                  <img
                    src={userInfo.avatar_url}
                    alt="Avatar"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userInfo.display_name && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nome de Exibição</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{userInfo.display_name}</p>
                  </div>
                )}

                {userInfo.bio_description && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Biografia</h3>
                    <p className="mt-1 text-gray-900">{userInfo.bio_description}</p>
                  </div>
                )}

                {userInfo.follower_count !== undefined && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Seguidores</h3>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {userInfo.follower_count.toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}

                {userInfo.following_count !== undefined && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Seguindo</h3>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {userInfo.following_count.toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}

                {userInfo.likes_count !== undefined && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Curtidas</h3>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {userInfo.likes_count.toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}

                {userInfo.video_count !== undefined && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Vídeos</h3>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {userInfo.video_count.toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={fetchUserInfo}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
                >
                  Atualizar Informações
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

