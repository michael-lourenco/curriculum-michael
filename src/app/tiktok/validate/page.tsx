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
    <div className="page-shell">
      <div className="max-w-3xl mx-auto">
        <div className="page-card shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-text-primary">
              Validar Access Token
            </h1>
            <Link
              href="/tiktok/home"
              className="text-accent hover:text-accent-dark hover:underline"
            >
              Voltar
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-text-secondary mb-2">
                Access Token
              </label>
              <textarea
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Cole o access_token aqui (ex: act.SmuxT7Y6GoKurXecCxD3XkHjqRBenh28tzkVeqyeVnIWsoCeCmVsCshGokXj!4524.va)"
                className="w-full px-4 py-2 border border-border rounded-md bg-surface text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                rows={3}
              />
            </div>

            <div className="flex gap-4 items-center">
              <button
                onClick={validateToken}
                disabled={loading || !token.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition disabled:bg-surface-hover disabled:cursor-not-allowed"
              >
                {loading ? 'Validando...' : 'Validar Token'}
              </button>
              <button
                onClick={async () => {
                  // Validar usando cookie (se disponível)
                  try {
                    setLoading(true);
                    setError(null);
                    setResult(null);
                    const response = await fetch('/tiktok/api/auth/validate', {
                      credentials: 'include',
                      headers: { 'Content-Type': 'application/json' },
                    });
                    const data = await response.json();
                    setResult(data);
                  } catch (err: any) {
                    setError(err.message || 'Erro ao validar token do cookie');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
                title="Validar token do cookie (se disponível)"
              >
                Validar do Cookie
              </button>
              <button
                onClick={() => {
                  setToken('');
                  setResult(null);
                  setError(null);
                }}
                className="px-6 py-2 bg-surface-hover text-text-secondary font-medium rounded hover:bg-surface transition"
              >
                Limpar
              </button>
              <Link
                href="/tiktok/api/auth/debug"
                className="ml-auto text-sm text-purple-600 hover:text-purple-800 underline"
                target="_blank"
              >
                🔍 Ver Diagnóstico Completo
              </Link>
            </div>

            {error && (
              <div className="alert-error p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className={`p-4 border-2 rounded ${result.valid ? 'alert-success border' : 'alert-error border'}`}>
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
                  <div className="p-4 bg-surface-hover rounded">
                    <p className="text-sm font-medium text-text-secondary mb-1">Token Preview:</p>
                    <p className="text-xs font-mono text-text-muted break-all">{result.token_preview}</p>
                  </div>
                )}

                {/* Escopos reais do token */}
                {result.scopes_from_token && (
                  <div className="alert-success p-4">
                    <p className="text-sm font-semibold text-green-800 mb-2">
                      ✅ Escopos Retornados pelo TikTok:
                    </p>
                    <div className="space-y-2 mb-2">
                      {result.scopes_array && result.scopes_array.map((scope: string, idx: number) => {
                        const isUpload = scope.includes('video.upload');
                        const isPublish = scope.includes('video.publish');
                        const isImportant = isUpload || isPublish;
                        
                        return (
                          <div
                            key={idx}
                            className={`flex items-center p-2 rounded ${
                              isImportant ? 'alert-success-subtle' : 'bg-surface border border-border'
                            }`}
                          >
                            {isImportant && (
                              <svg className="h-4 w-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                            <code className={`text-xs ${isImportant ? 'text-green-800 font-semibold' : 'text-green-700'}`}>
                              {scope}
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
                    
                    {/* Análise de escopos */}
                    {result.scope_analysis && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-xs font-semibold text-green-800 mb-2">Análise:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            {result.scope_analysis.has_upload_scope ? (
                              <span className="text-green-700">✅ video.upload disponível</span>
                            ) : (
                              <span className="text-red-700">❌ video.upload não encontrado</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {result.scope_analysis.has_publish_scope ? (
                              <span className="text-green-700">✅ video.publish disponível</span>
                            ) : (
                              <span className="text-red-700">❌ video.publish não encontrado</span>
                            )}
                          </div>
                          {result.scope_analysis.missing_scopes && result.scope_analysis.missing_scopes.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-green-200">
                              <p className="text-yellow-700 font-medium">Escopos faltantes:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.scope_analysis.missing_scopes.map((scope: string) => (
                                  <span key={scope} className="text-xs bg-yellow-100 text-inherit px-2 py-1 rounded">
                                    {scope}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {result.note && (
                      <p className="text-xs text-green-600 mt-2 italic">{result.note}</p>
                    )}
                  </div>
                )}

                {/* Escopos inferidos (fallback) */}
                {result.inferred_scopes && !result.scopes_from_token && (
                  <div className="alert-info p-4">
                    <p className="text-sm font-medium text-blue-700 mb-1">Escopos Inferidos (baseado nos campos):</p>
                    <p className="text-sm text-blue-600">{result.inferred_scopes}</p>
                    {result.note && (
                      <p className="text-xs text-blue-500 mt-2 italic">{result.note}</p>
                    )}
                    <div className="mt-3 p-2 alert-warning">
                      <p className="text-xs text-inherit">
                        💡 <strong>Dica:</strong> Faça uma nova autenticação para capturar os escopos reais retornados pelo TikTok.
                      </p>
                    </div>
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
                  <div className="p-4 bg-surface-hover rounded">
                    <p className="text-sm font-medium text-text-secondary mb-2">Informações do Usuário:</p>
                    <pre className="text-xs json-pre overflow-auto max-h-64">
                      {JSON.stringify(result.user_info, null, 2)}
                    </pre>
                  </div>
                )}

                {result.error && (
                  <div className="alert-error p-4">
                    <p className="text-sm font-medium text-red-700 mb-1">Erro:</p>
                    <p className="text-sm text-red-600">{result.error}</p>
                    {result.log_id && (
                      <p className="text-xs text-red-500 mt-1">Log ID: {result.log_id}</p>
                    )}
                  </div>
                )}

                <details className="p-4 bg-surface-hover rounded">
                  <summary className="cursor-pointer text-sm font-medium text-text-secondary hover:text-text-primary">
                    Ver resposta completa (debug)
                  </summary>
                  <pre className="mt-2 text-xs json-pre overflow-auto max-h-96">
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

