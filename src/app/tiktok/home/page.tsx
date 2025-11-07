export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TikTok API Next.js SDK
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            SDK completo em TypeScript para interagir com a API do TikTok.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Recursos Disponíveis
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Autenticação OAuth completa</li>
                <li>Gerenciamento de usuários</li>
                <li>Listagem e consulta de vídeos</li>
                <li>Publicação de conteúdo</li>
                <li>Processamento de webhooks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Como Usar
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-4">
                  <strong>1. Configurar variáveis de ambiente:</strong>
                </p>
                <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_REDIRECT_URI=http://localhost:3000/tiktok`}
                </pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700 mb-4">
                  <strong>2. Iniciar autenticação:</strong>
                </p>
                <div className="space-y-3">
                  <div>
                    <a
                      href="/tiktok/api/auth/authorize?scope=user.info.basic"
                      className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition"
                    >
                      Autorizar com TikTok (Apenas user.info.basic)
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      Escopo básico - recomendado para começar
                    </p>
                  </div>
                  <div>
                    <a
                      href="/tiktok/api/auth/authorize?scope=user.info.basic,video.list"
                      className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition"
                    >
                      Autorizar com TikTok (user.info.basic + video.list)
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      Escopos completos - certifique-se de que estão habilitados no app
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Importante:</strong> Se receber erro de "invalid_scope", você precisa habilitar os escopos no <a href="https://developers.tiktok.com/apps" target="_blank" rel="noopener noreferrer" className="underline">TikTok for Developers</a>. 
                    Comece testando apenas com <code className="bg-yellow-100 px-1 rounded">user.info.basic</code>.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Endpoints da API
              </h2>
              <div className="space-y-2 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <code className="text-blue-600">GET /tiktok/api/auth/authorize</code>
                  <span className="text-gray-600 ml-2">- Iniciar autenticação OAuth</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <code className="text-blue-600">GET /tiktok/api/auth/callback</code>
                  <span className="text-gray-600 ml-2">- Callback de autenticação</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <code className="text-blue-600">GET /tiktok/api/user/info</code>
                  <span className="text-gray-600 ml-2">- Informações do usuário</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <code className="text-blue-600">POST /tiktok/api/videos/list</code>
                  <span className="text-gray-600 ml-2">- Listar vídeos</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <code className="text-blue-600">POST /tiktok/webhook</code>
                  <span className="text-gray-600 ml-2">- Receber webhooks</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

