import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - TikTok API Learning App',
  description: 'Privacy Policy for the TikTok API learning and testing application',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introdução</h2>
              <p className="text-gray-700 mb-4">
                Esta Política de Privacidade descreve como o TikTok API Learning App coleta, usa e protege suas informações quando você utiliza nosso aplicativo educacional. Este aplicativo foi desenvolvido exclusivamente para fins de aprendizado e demonstração da API do TikTok.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Importante:</strong> Este aplicativo é um projeto educacional e não armazena dados pessoais dos usuários. Todas as interações com dados do TikTok são realizadas de forma transparente e segura.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Informações que Coletamos</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Dados do TikTok (Temporários)</h3>
              <p className="text-gray-700 mb-4">
                Quando você autoriza o aplicativo a acessar sua conta do TikTok, podemos receber temporariamente:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Informações básicas do perfil:</strong> Nome de usuário, foto de perfil, informações públicas do perfil</li>
                <li><strong>Estatísticas básicas:</strong> Número de seguidores, seguindo, curtidas (apenas para demonstração)</li>
                <li><strong>Lista de vídeos:</strong> Títulos e metadados de vídeos públicos (apenas para exibição)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Dados Técnicos</h3>
              <p className="text-gray-700 mb-4">
                Coletamos automaticamente algumas informações técnicas para funcionamento do aplicativo:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Endereço IP (anonimizado)</li>
                <li>Tipo de navegador e sistema operacional</li>
                <li>Páginas visitadas e tempo de permanência</li>
                <li>Data e hora de acesso</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Como Usamos Suas Informações</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos as informações coletadas exclusivamente para:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Demonstração educacional:</strong> Mostrar como a API do TikTok funciona</li>
                <li><strong>Funcionalidade do aplicativo:</strong> Exibir dados públicos do seu perfil TikTok</li>
                <li><strong>Melhoria do serviço:</strong> Analisar padrões de uso para melhorar a experiência educacional</li>
                <li><strong>Segurança:</strong> Proteger contra uso indevido e garantir operação segura</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Compartilhamento de Informações</h2>
              <p className="text-gray-700 mb-4">
                <strong>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros.</strong>
              </p>
              <p className="text-gray-700 mb-4">
                Podemos compartilhar informações apenas nas seguintes situações limitadas:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Com o TikTok:</strong> Conforme necessário para funcionamento da API (dados já públicos)</li>
                <li><strong>Por obrigação legal:</strong> Quando exigido por lei ou ordem judicial</li>
                <li><strong>Para proteção:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Armazenamento e Segurança</h2>
              <p className="text-gray-700 mb-4">
                <strong>Política de Não Armazenamento:</strong> Este aplicativo educacional não armazena dados pessoais dos usuários em servidores ou bancos de dados.
              </p>
              <p className="text-gray-700 mb-4">
                Medidas de segurança implementadas:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Conexões seguras (HTTPS) para todas as comunicações</li>
                <li>Autenticação OAuth segura com TikTok</li>
                <li>Dados processados apenas em memória durante a sessão</li>
                <li>Logs anonimizados sem informações pessoais</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies e Tecnologias Similares</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos cookies apenas para funcionalidade essencial do aplicativo:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Cookies de sessão:</strong> Para manter sua autenticação durante o uso</li>
                <li><strong>Cookies de preferências:</strong> Para lembrar configurações de interface</li>
                <li><strong>Cookies de segurança:</strong> Para proteção contra ataques</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Você pode desabilitar cookies em seu navegador, mas isso pode afetar a funcionalidade do aplicativo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Seus Direitos</h2>
              <p className="text-gray-700 mb-4">
                Como este é um aplicativo educacional que não armazena dados pessoais, você tem os seguintes direitos:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Revogação de acesso:</strong> Pode revogar o acesso do aplicativo à sua conta TikTok a qualquer momento</li>
                <li><strong>Controle de dados:</strong> Todos os dados são processados apenas durante a sessão ativa</li>
                <li><strong>Transparência:</strong> Código-fonte disponível para auditoria (projeto educacional)</li>
                <li><strong>Contato:</strong> Pode entrar em contato para esclarecimentos sobre privacidade</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Menores de Idade</h2>
              <p className="text-gray-700 mb-4">
                Este aplicativo é destinado a fins educacionais e não coleta intencionalmente informações de menores de 18 anos. Se você é menor de idade, deve obter autorização dos pais ou responsáveis antes de usar este aplicativo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Alterações nesta Política</h2>
              <p className="text-gray-700 mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente. As alterações significativas serão comunicadas através de aviso no aplicativo. A data da última atualização está indicada no topo desta página.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contato</h2>
              <p className="text-gray-700 mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos suas informações, entre em contato:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:kontempler@gmail.com" className="text-blue-600 hover:text-blue-800 underline">kontempler@gmail.com</a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Assunto:</strong> Privacy Policy - TikTok API Learning App
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Conformidade Legal</h2>
              <p className="text-gray-700 mb-4">
                Esta política está em conformidade com:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Lei Geral de Proteção de Dados (LGPD) - Brasil</li>
                <li>Regulamento Geral sobre a Proteção de Dados (GDPR) - União Europeia</li>
                <li>Termos de Serviço da API do TikTok</li>
                <li>Políticas de Privacidade do TikTok</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} TikTok API Learning App. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Esta é uma aplicação educacional para demonstração da API do TikTok.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
