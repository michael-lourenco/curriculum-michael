import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - TikTok API Learning App',
  description: 'Terms of Service for the TikTok API learning and testing application',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 mb-4">
                Ao acessar e usar este aplicativo de aprendizado da API do TikTok, você concorda em cumprir e estar vinculado a estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não deve usar este aplicativo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <p className="text-gray-700 mb-4">
                Este aplicativo é projetado como um ambiente de aprendizado e teste para explorar a API do TikTok. Seu objetivo principal é entender e demonstrar como as integrações do TikTok funcionam em um cenário de aplicativo real.
              </p>
              <p className="text-gray-700 mb-4">
                O aplicativo utiliza escopos de autenticação para permitir login seguro do usuário e conexão com sua conta do TikTok. Após a autorização, o aplicativo pode acessar informações básicas do perfil do usuário, recuperar conteúdo de vídeo e interagir com dados públicos de acordo com as permissões do TikTok.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Funcionalidades e Escopos</h2>
              <p className="text-gray-700 mb-4">
                O aplicativo utiliza os seguintes produtos e escopos da API do TikTok:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Login Kit:</strong> Para autenticação segura do usuário</li>
                <li><strong>Content Posting API:</strong> Para demonstração de postagem de conteúdo</li>
                <li><strong>Share Kit:</strong> Para funcionalidades de compartilhamento</li>
                <li><strong>Webhooks:</strong> Para recebimento de notificações</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Escopos utilizados:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><code>user.info.basic</code> - Informações básicas do usuário</li>
                <li><code>user.info.profile</code> - Informações do perfil do usuário</li>
                <li><code>user.info.stats</code> - Estatísticas do usuário</li>
                <li><code>video.list</code> - Lista de vídeos do usuário</li>
                <li><code>video.publish</code> - Publicação de vídeos</li>
                <li><code>video.upload</code> - Upload de vídeos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Uso Aceitável</h2>
              <p className="text-gray-700 mb-4">
                Você concorda em usar este aplicativo apenas para fins educacionais e de teste. É proibido:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Usar o aplicativo para qualquer propósito comercial sem autorização</li>
                <li>Tentar acessar dados não autorizados</li>
                <li>Violar os Termos de Serviço do TikTok</li>
                <li>Usar o aplicativo de forma que possa danificar ou prejudicar outros usuários</li>
                <li>Armazenar ou compartilhar dados sensíveis dos usuários</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacidade e Dados</h2>
              <p className="text-gray-700 mb-4">
                Este aplicativo é projetado para fins educacionais e não armazena dados sensíveis dos usuários. Todas as interações com a API do TikTok são realizadas de forma transparente e segura. Para mais informações sobre como tratamos dados, consulte nossa <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">Política de Privacidade</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitação de Responsabilidade</h2>
              <p className="text-gray-700 mb-4">
                Este aplicativo é fornecido "como está" para fins educacionais. Não garantimos que o aplicativo estará sempre disponível ou livre de erros. Você usa este aplicativo por sua própria conta e risco.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Propriedade Intelectual</h2>
              <p className="text-gray-700 mb-4">
                Este aplicativo é um projeto educacional. Todas as marcas registradas e direitos autorais relacionados ao TikTok pertencem à ByteDance Ltd. Este aplicativo não está afiliado oficialmente ao TikTok.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Modificações dos Termos</h2>
              <p className="text-gray-700 mb-4">
                Reservamos o direito de modificar estes Termos de Serviço a qualquer momento. As modificações entrarão em vigor imediatamente após sua publicação. Seu uso continuado do aplicativo após as modificações constitui aceitação dos novos termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contato</h2>
              <p className="text-gray-700 mb-4">
                Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato através do email: <a href="mailto:kontempler@gmail.com" className="text-blue-600 hover:text-blue-800 underline">kontempler@gmail.com</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Lei Aplicável</h2>
              <p className="text-gray-700 mb-4">
                Estes Termos de Serviço são regidos pelas leis do Brasil. Qualquer disputa será resolvida nos tribunais competentes do Brasil.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} TikTok API Learning App. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
