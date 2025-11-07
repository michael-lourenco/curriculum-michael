'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [cookieInfo, setCookieInfo] = useState<string>('');
  const [tokenTest, setTokenTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkCookies();
    testToken();
  }, []);

  function checkCookies() {
    // Cookies httpOnly não podem ser acessados via JavaScript
    // Mas podemos tentar fazer uma requisição para verificar
    setCookieInfo('Cookies HTTP-only não podem ser lidos via JavaScript. Verificando via API...');
  }

  async function testToken() {
    try {
      setLoading(true);
      const response = await fetch('/tiktok/api/user/info', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setTokenTest({
        status: response.status,
        statusText: response.statusText,
        data,
        hasToken: response.status !== 401,
      });
    } catch (error: any) {
      setTokenTest({
        error: error.message,
        hasToken: false,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold mb-6">Debug - TikTok Token</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Status do Token</h2>
              {loading ? (
                <p>Verificando...</p>
              ) : (
                <div className="bg-gray-50 p-4 rounded">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(tokenTest, null, 2)}
                  </pre>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Informações</h2>
              <div className="bg-blue-50 p-4 rounded text-sm">
                <p className="mb-2">
                  <strong>Nota:</strong> Cookies HTTP-only não podem ser lidos via JavaScript por segurança.
                </p>
                <p className="mb-2">
                  O token está sendo testado fazendo uma requisição para <code>/tiktok/api/user/info</code>.
                </p>
                <p>
                  Se o token estiver presente e válido, você verá status 200. 
                  Se não estiver presente, verá status 401.
                </p>
              </div>
            </section>

            <section>
              <button
                onClick={testToken}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Testar Token Novamente
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

