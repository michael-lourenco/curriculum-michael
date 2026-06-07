import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade — Side Hero',
  description:
    'Política de Privacidade da extensão Side Hero — Idle RPG para Google Chrome.',
};

const LAST_UPDATED = '7 de junho de 2025';

export default function SideHeroPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            Política de Privacidade
          </h1>
          <p className="text-center text-gray-600 mb-2">
            <strong>Side Hero — Idle RPG</strong> · Extensão Chrome
          </p>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-2 text-center">
              <strong>Desenvolvedor:</strong> Michael Lourenço
            </p>
            <p className="text-gray-600 mb-6">
              <strong>Última atualização:</strong> {LAST_UPDATED}
            </p>

            <p className="text-gray-700 mb-6">
              Esta política descreve como a extensão <strong>Side Hero</strong>{' '}
              (“Extensão”) trata informações quando você a instala e utiliza no
              Google Chrome.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#e94560] mb-4">
                1. Resumo
              </h2>
              <div className="bg-gray-50 rounded-xl p-5 mb-4">
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Não coletamos dados pessoais identificáveis.</li>
                  <li>
                    Não vendemos, alugamos ou compartilhamos dados com
                    terceiros.
                  </li>
                  <li>O progresso do jogo fica salvo apenas no seu navegador.</li>
                  <li>
                    Não há servidor próprio da Extensão para armazenar dados.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#e94560] mb-4">
                2. Dados armazenados localmente
              </h2>
              <p className="text-gray-700 mb-4">
                A Extensão utiliza o armazenamento local do Chrome (
                <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">
                  chrome.storage.local
                </code>
                ) para guardar informações necessárias ao funcionamento do
                jogo, como:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>progresso dos heróis, estágio, ouro e inventário;</li>
                <li>
                  preferências do painel lateral (visível, recolhido, largura);
                </li>
                <li>registros recentes de batalha exibidos na interface.</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Esses dados permanecem no seu dispositivo e são sincronizados
                apenas pelos mecanismos do próprio Chrome, se você tiver
                sincronização de extensões ativada na sua conta Google.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#e94560] mb-4">
                3. Permissões da Extensão
              </h2>
              <p className="text-gray-700 mb-4">
                A Extensão solicita as seguintes permissões:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>storage</strong> — salvar o estado do jogo e
                  preferências localmente.
                </li>
                <li>
                  <strong>alarms</strong> — avançar o combate idle em segundo
                  plano.
                </li>
                <li>
                  <strong>tabs</strong> — comunicar-se com a aba ativa ao clicar
                  no ícone da Extensão.
                </li>
                <li>
                  <strong>scripting</strong> e <strong>activeTab</strong> —
                  injetar o painel lateral na página aberta quando você
                  interage com a Extensão.
                </li>
                <li>
                  <strong>content scripts em páginas web</strong> — exibir o
                  painel lateral à direita e ajustar o layout da página para que
                  o conteúdo não fique coberto pelo jogo.
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                A Extensão <strong>não</strong> lê senhas, formulários
                bancários, e-mails ou conteúdo privado das páginas para enviar a
                terceiros. O script de conteúdo existe somente para exibir o
                painel do jogo e aplicar o ajuste visual necessário.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#e94560] mb-4">
                4. Dados que não coletamos
              </h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Nome, e-mail, telefone ou endereço.</li>
                <li>Histórico de navegação enviado a servidores externos.</li>
                <li>Dados de localização.</li>
                <li>
                  Informações financeiras ou de login de sites visitados.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#e94560] mb-4">
                5. Serviços de terceiros
              </h2>
              <p className="text-gray-700 mb-4">
                A Extensão não integra analytics, publicidade ou rastreadores de
                terceiros. Os sites que você visita continuam sujeitos às
                políticas de privacidade desses próprios sites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#e94560] mb-4">
                6. Segurança
              </h2>
              <p className="text-gray-700 mb-4">
                Empregamos boas práticas de desenvolvimento para manter o código
                da Extensão organizado e limitado ao necessário para o
                funcionamento do jogo. Ainda assim, recomendamos manter o
                navegador e a Extensão atualizados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#e94560] mb-4">
                7. Seus direitos e controle
              </h2>
              <p className="text-gray-700 mb-4">Você pode, a qualquer momento:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  desinstalar a Extensão, o que remove os dados locais associados
                  a ela;
                </li>
                <li>
                  limpar os dados da Extensão em{' '}
                  <em>chrome://extensions</em> → Detalhes → Limpar dados;
                </li>
                <li>
                  ocultar o painel lateral pelo ícone ou pelos controles da
                  própria interface.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#e94560] mb-4">
                8. Crianças
              </h2>
              <p className="text-gray-700 mb-4">
                A Extensão não é direcionada especificamente a crianças e não
                coleta intencionalmente dados pessoais de menores.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#e94560] mb-4">
                9. Alterações nesta política
              </h2>
              <p className="text-gray-700 mb-4">
                Podemos atualizar esta página para refletir mudanças na Extensão
                ou exigências legais. A data da última atualização será revisada
                no topo do documento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#e94560] mb-4">
                10. Contato
              </h2>
              <p className="text-gray-700 mb-4">
                Em caso de dúvidas sobre esta política, entre em contato pelo
                site{' '}
                <a
                  href="https://michaellourenco.com"
                  className="text-[#e94560] hover:text-[#c73a52] underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  michaellourenco.com
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>© 2025 Michael Lourenço — Side Hero</p>
          </div>
        </div>
      </div>
    </div>
  );
}
