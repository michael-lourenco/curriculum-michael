'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ValidateTokenPage() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function validateToken() {
    if (!token.trim()) {
      setError('Por favor, insira um token');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch(`/tiktok/api/auth/validate?access_token=${encodeURIComponent(token)}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao validar token');
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
              Validar Access Token
            </h1>
            <Link
              href="/tiktok/home"
              className="text-blue-600 hover:underline"
            >
              Voltar
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                Access Token
              </label>
              <textarea
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Cole o access_token aqui (ex: act.SmuxT7Y6GoKurXecCxD3XkHjqRBenh28tzkVeqyeVnIWsoCeCmVsCshGokXj!4524.va)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={validateToken}
                disabled={loading || !token.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Validando...' : 'Validar Token'}
              </button>
              <button
                onClick={() => {
                  setToken('');
                  setResult(null);
                  setError(null);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 transition"
              >
                Limpar
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className={`p-4 border-2 rounded ${result.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {result.valid ? (
                      <>
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-lg font-semibold text-green-800">Token Válido</h3>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-lg font-semibold text-red-800">Token Inválido</h3>
                      </>
                    )}
                  </div>
                  <p className={`text-sm ${result.valid ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                </div>

                {result.token_preview && (
                  <div className="p-4 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700 mb-1">Token Preview:</p>
                    <p className="text-xs font-mono text-gray-600 break-all">{result.token_preview}</p>
                  </div>
                )}

                {result.inferred_scopes && (
                  <div className="p-4 bg-blue-50 rounded">
                    <p className="text-sm font-medium text-blue-700 mb-1">Escopos Inferidos:</p>
                    <p className="text-sm text-blue-600">{result.inferred_scopes}</p>
                    {result.note && (
                      <p className="text-xs text-blue-500 mt-2 italic">{result.note}</p>
                    )}
                  </div>
                )}

                {result.available_fields && result.available_fields.length > 0 && (
                  <div className="p-4 bg-purple-50 rounded">
                    <p className="text-sm font-medium text-purple-700 mb-1">Campos Disponíveis:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.available_fields.map((field: string) => (
                        <span key={field} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.user_info && (
                  <div className="p-4 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700 mb-2">Informações do Usuário:</p>
                    <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                      {JSON.stringify(result.user_info, null, 2)}
                    </pre>
                  </div>
                )}

                {result.error && (
                  <div className="p-4 bg-red-50 rounded">
                    <p className="text-sm font-medium text-red-700 mb-1">Erro:</p>
                    <p className="text-sm text-red-600">{result.error}</p>
                    {result.log_id && (
                      <p className="text-xs text-red-500 mt-1">Log ID: {result.log_id}</p>
                    )}
                  </div>
                )}

                <details className="p-4 bg-gray-50 rounded">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Ver resposta completa (debug)
                  </summary>
                  <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

