import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso — Redimensionador de Imagens',
  description:
    'Termos de Uso da extensão Redimensionador de Imagens para Google Chrome.',
};

const LAST_UPDATED = '7 de julho de 2026';
const ACCENT = 'text-[#ff8338]';
const ACCENT_HOVER = 'hover:text-[#e56f28]';

export default function RedimensionadorTermsOfService() {
  return (
    <div className="page-shell">
      <div className="max-w-4xl mx-auto">
        <p className="text-center mb-4">
          <Link href="/redimensionador-imagens/privacy" className={`text-[#ff8338] ${ACCENT_HOVER} underline`}>
            Política de Privacidade
          </Link>
        </p>
        <div className="page-card">
          <h1 className="text-4xl font-bold text-text-primary mb-2 text-center">
            Termos de Uso
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

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>1. Aceitação</h2>
              <p className="text-text-secondary mb-4">
                Estes Termos de Uso (“Termos”) regem o uso da extensão{' '}
                <strong>Redimensionador de Imagens</strong> (“Extensão”), disponível na Chrome
                Web Store. Ao instalar ou utilizar a Extensão, você concorda com estes Termos. Se
                não concordar, desinstale a Extensão e interrompa o uso.
              </p>
              <p className="text-text-secondary mb-4">
                O uso da Chrome Web Store também está sujeito aos termos e políticas do Google.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>2. Descrição do serviço</h2>
              <p className="text-text-secondary mb-4">
                A Extensão permite redimensionar uma ou várias imagens no painel lateral do Chrome,
                com processamento <strong>local</strong> no navegador. Recursos incluem:
              </p>
              <ul className="list-disc pl-6 mb-4 text-text-secondary">
                <li>seleção de imagens por arrastar/soltar ou seletor de arquivos;</li>
                <li>redimensionamento proporcional por pixels ou percentual;</li>
                <li>exportação individual ou em lote (ZIP);</li>
                <li>doação voluntária opcional via Stripe (sem paywall).</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>3. Licença de uso</h2>
              <p className="text-text-secondary mb-4">
                Concedemos a você uma licença pessoal, não exclusiva, intransferível e revogável
                para instalar e usar a Extensão para fins privados e não comerciais de
                redimensionamento de imagens. Você não pode copiar, modificar, distribuir, vender
                ou sublicenciar a Extensão ou seus componentes, exceto quando a lei permitir
                expressamente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>4. Suas imagens e responsabilidades</h2>
              <p className="text-text-secondary mb-4">
                Você é o único responsável pelas imagens que seleciona e pelos arquivos exportados.
                Garanta que possui direitos ou permissão para processar e redistribuir esse
                conteúdo. A Extensão não verifica direitos autorais, metadados sensíveis ou
                conformidade legal do material processado.
              </p>
              <p className="text-text-secondary mb-4">
                Não utilize a Extensão para atividades ilegais, violação de privacidade de
                terceiros ou qualquer fim que infrinja leis aplicáveis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>5. Uso aceitável</h2>
              <p className="text-text-secondary mb-4">Você concorda em não:</p>
              <ul className="list-disc pl-6 mb-4 text-text-secondary">
                <li>engenharia reversa ou desmontagem da Extensão, salvo quando a lei exigir;</li>
                <li>usar a Extensão para distribuir malware ou conteúdo ilícito;</li>
                <li>tentar sobrecarregar, interferir ou burlar limitações técnicas do Chrome;</li>
                <li>representar-se falsamente como desenvolvedor ou revendedor autorizado.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>6. Doações</h2>
              <p className="text-text-secondary mb-4">
                Doações são voluntárias, processadas pelo Stripe em site externo, e não constituem
                compra de funcionalidades. Reembolsos e disputas de pagamento seguem as políticas do
                Stripe e da legislação aplicável ao meio de pagamento escolhido.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>7. Atualizações e alterações</h2>
              <p className="text-text-secondary mb-4">
                Podemos publicar atualizações da Extensão (correções, melhorias ou ajustes
                técnicos). Também podemos revisar estes Termos; a data no topo indicará alterações
                relevantes. O uso continuado após mudanças constitui aceitação, na medida permitida
                pela lei.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>8. Isenção de garantias</h2>
              <p className="text-text-secondary mb-4">
                A Extensão é fornecida <strong>“no estado em que se encontra”</strong> e{' '}
                <strong>“conforme disponível”</strong>, sem garantias de qualquer tipo, na máxima
                extensão permitida por lei. Não garantimos que o redimensionamento atenderá a todos
                os casos de uso, formatos ou requisitos de qualidade, nem operação ininterrupta ou
                livre de erros.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>9. Limitação de responsabilidade</h2>
              <p className="text-text-secondary mb-4">
                Na máxima extensão permitida pela lei aplicável, não seremos responsáveis por danos
                indiretos, incidentais, especiais, consequenciais ou punitivos, nem por perda de
                lucros, dados ou arquivos, decorrentes do uso ou da impossibilidade de uso da
                Extensão — incluindo perda ou corrupção de imagens por falha do dispositivo,
                navegador ou exportação interrompida.
              </p>
              <p className="text-text-secondary mb-4">
                Nossa responsabilidade agregada por qualquer reclamação relacionada a estes Termos
                ou à Extensão não excederá o valor que você nos pagou especificamente nos últimos
                doze (12) meses por doações voluntárias (se houver).
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>10. Propriedade intelectual</h2>
              <p className="text-text-secondary mb-4">
                A Extensão, sua marca, interface e código são protegidos por leis de propriedade
                intelectual. Google e Chrome são marcas do Google LLC. Estes Termos não concedem
                direitos sobre marcas de terceiros.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>11. Encerramento</h2>
              <p className="text-text-secondary mb-4">
                Você pode encerrar o uso a qualquer momento desinstalando a Extensão. Podemos
                deixar de disponibilizar a Extensão ou recursos específicos. Disposições que por
                natureza devam subsistir (por exemplo limitações de responsabilidade) permanecem
                válidas após o encerramento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>12. Lei aplicável</h2>
              <p className="text-text-secondary mb-4">
                Estes Termos são regidos pelas leis aplicáveis na sua jurisdição, respeitadas as
                normas imperativas de proteção ao consumidor e as regras da Chrome Web Store quando
                couberem.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${ACCENT} mb-4`}>13. Contato</h2>
              <p className="text-text-secondary mb-4">
                Dúvidas sobre estes Termos:{' '}
                <a href="https://michaellourenco.com" className={`${ACCENT} ${ACCENT_HOVER} underline`} target="_blank" rel="noopener noreferrer">
                  michaellourenco.com
                </a>{' '}
                ou contato indicado na listagem da Chrome Web Store.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-text-muted text-sm">
            <p>© 2026 Michael Lourenço — Redimensionador de Imagens</p>
            <p className="mt-2">
              <Link href="/redimensionador-imagens/privacy" className={`text-[#ff8338] ${ACCENT_HOVER} underline`}>
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
