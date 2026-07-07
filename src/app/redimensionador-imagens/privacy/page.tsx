import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade — Redimensionador de Imagens',
  description:
    'Política de Privacidade da extensão Redimensionador de Imagens para Google Chrome.',
};

const LAST_UPDATED = '7 de julho de 2026';
const ACCENT = 'text-[#ff8338]';
const ACCENT_HOVER = 'hover:text-[#e56f28]';

export default function RedimensionadorPrivacyPolicy() {
  return (
    <div className="page-shell">
      <div className="max-w-4xl mx-auto">
        <p className="text-center mb-4">
          <Link href="/redimensionador-imagens/terms" className={`text-[#ff8338] ${ACCENT_HOVER} underline`}>
            Termos de Uso
          </Link>
        </p>
        <div className="page-card">
          <h1 className="text-4xl font-bold text-text-primary mb-2 text-center">
            Política de Privacidade
          </h1>
          <p className="text-center text-text-muted mb-2">
            <strong>Redimensionador de Imagens</strong> · Extensão Chrome
          </p>

          <div className="prose prose-lg max-w-none">
            <p className="text-text-muted mb-2 text-center">
              <strong>Desenvolvedor:</strong> Michael Lourenço
            </p>
            <p className="text-text-muted mb-6">
              <strong>Última atualização:</strong> {LAST_UPDATED}
            </p>

            <p className="text-text-secondary mb-6">
              Esta política descreve como a extensão <strong>Redimensionador de Imagens</strong>{' '}
              (“Extensão”) trata informações quando você a instala e utiliza no Google Chrome.
            </p>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>1. Resumo</h2>
              <div className="bg-surface-hover rounded-xl p-5 mb-4">
                <ul className="list-disc pl-6 text-text-secondary">
                  <li>As imagens são processadas <strong>100% no seu navegador</strong> — não enviamos arquivos a servidores nossos.</li>
                  <li>Não exigimos login, conta ou cadastro.</li>
                  <li>Não coletamos dados pessoais identificáveis para operar a Extensão.</li>
                  <li>Não vendemos, alugamos ou compartilhamos dados com terceiros para fins de marketing.</li>
                  <li>Não há analytics nem rastreadores embutidos na Extensão.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>2. O que a Extensão faz</h2>
              <p className="text-text-secondary mb-4">
                A Extensão abre no <strong>painel lateral</strong> do Chrome e permite selecionar,
                redimensionar e exportar imagens (individualmente ou em lote/ZIP). Todo o
                processamento ocorre localmente com APIs do navegador; seus arquivos originais e
                redimensionados permanecem sob seu controle.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>3. Dados e armazenamento</h2>
              <p className="text-text-secondary mb-4">
                Durante o uso normal, as imagens e opções de redimensionamento ficam em{' '}
                <strong>memória da sessão</strong> do painel lateral. Ao fechar o painel ou
                recarregar a Extensão, esses dados temporários são descartados.
              </p>
              <p className="text-text-secondary mb-4">
                A Extensão <strong>não</strong> utiliza{' '}
                <code className="text-sm bg-surface-hover px-1.5 py-0.5 rounded">chrome.storage</code>,{' '}
                banco de dados remoto nem upload de imagens para servidores operados por nós.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>4. Permissões</h2>
              <p className="text-text-secondary mb-4">A Extensão solicita:</p>
              <ul className="list-disc pl-6 mb-4 text-text-secondary">
                <li>
                  <strong>sidePanel</strong> — exibir a interface de redimensionamento no painel
                  lateral do Chrome ao clicar no ícone da Extensão.
                </li>
              </ul>
              <p className="text-text-secondary mb-4">
                A Extensão <strong>não</strong> injeta scripts em páginas web, não lê o conteúdo
                das abas abertas e não acessa arquivos do seu computador fora das imagens que você
                seleciona manualmente (arrastar, soltar ou seletor de arquivos).
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>5. Doação opcional (Stripe)</h2>
              <p className="text-text-secondary mb-4">
                A Extensão oferece um botão de <strong>doação voluntária</strong> que abre o
                checkout do <a href="https://stripe.com" className={`${ACCENT} ${ACCENT_HOVER} underline`} target="_blank" rel="noopener noreferrer">Stripe</a>{' '}
                em uma nova aba. A doação é totalmente opcional e{' '}
                <strong>não desbloqueia nem bloqueia</strong> nenhuma funcionalidade.
              </p>
              <p className="text-text-secondary mb-4">
                Pagamentos são processados pelo Stripe conforme a{' '}
                <a href="https://stripe.com/privacy" className={`${ACCENT} ${ACCENT_HOVER} underline`} target="_blank" rel="noopener noreferrer">Política de Privacidade do Stripe</a>.
                Não recebemos nem armazenamos dados de cartão na Extensão.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>6. Dados que não coletamos</h2>
              <ul className="list-disc pl-6 mb-4 text-text-secondary">
                <li>Nome, e-mail, telefone ou endereço para usar a Extensão.</li>
                <li>Conteúdo das suas imagens enviado a servidores nossos.</li>
                <li>Histórico de navegação ou dados de sites visitados.</li>
                <li>Informações financeiras ou de login de terceiros.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>7. Serviços de terceiros</h2>
              <p className="text-text-secondary mb-4">
                Além do Stripe (somente se você optar por doar), a distribuição da Extensão ocorre
                pela <strong>Chrome Web Store</strong>, sujeita às políticas do Google. O Google
                pode processar dados técnicos de instalação e atualização conforme seus próprios
                termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>8. Segurança</h2>
              <p className="text-text-secondary mb-4">
                Empregamos boas práticas de desenvolvimento para manter o código enxuto e limitado
                ao necessário. Recomendamos manter o Chrome e a Extensão atualizados. Evite
                processar imagens confidenciais em dispositivos compartilhados sem as precauções
                usuais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>9. Seus direitos e controle</h2>
              <p className="text-text-secondary mb-4">Você pode, a qualquer momento:</p>
              <ul className="list-disc pl-6 mb-4 text-text-secondary">
                <li>desinstalar a Extensão em <em>chrome://extensions</em>;</li>
                <li>limpar dados da Extensão em Detalhes → Limpar dados;</li>
                <li>deixar de usar o botão de doação se não quiser interagir com o Stripe.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>10. Crianças</h2>
              <p className="text-text-secondary mb-4">
                A Extensão não é direcionada especificamente a crianças e não coleta
                intencionalmente dados pessoais de menores.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>11. Alterações nesta política</h2>
              <p className="text-text-secondary mb-4">
                Podemos atualizar esta página para refletir mudanças na Extensão ou exigências
                legais. A data da última atualização será revisada no topo do documento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>12. Contato</h2>
              <p className="text-text-secondary mb-4">
                Em caso de dúvidas sobre esta política, entre em contato pelo site{' '}
                <a href="https://michaellourenco.com" className={`${ACCENT} ${ACCENT_HOVER} underline`} target="_blank" rel="noopener noreferrer">
                  michaellourenco.com
                </a>{' '}
                ou pela listagem da Extensão na Chrome Web Store.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-text-muted text-sm">
            <p>© 2026 Michael Lourenço — Redimensionador de Imagens</p>
            <p className="mt-2">
              <Link href="/redimensionador-imagens/terms" className={`text-[#ff8338] ${ACCENT_HOVER} underline`}>
                Termos de Uso
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
