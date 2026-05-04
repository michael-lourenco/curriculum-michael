# Math Rush — páginas legais para Google Play

**Data:** 2026-05-04  
**Objetivo:** Fornecer URLs de **Privacy Policy** e **Terms of Service** em inglês para publicação na Google Play do jogo **Math Rush: Desafio da Esfinge** (título em inglês nas páginas: **Math Rush: Sphinx Challenge**), incluindo menção a **Google Play Games Services** / **leaderboards**.

## Rotas Next.js (App Router)

| Caminho no projeto | Rota URL | Função |
|--------------------|----------|--------|
| `src/app/math-rush/privacy/page.tsx` | `/math-rush/privacy` | Política de privacidade em inglês (Tailwind, mesmo padrão de `src/app/privacy`). Conteúdo: jogo, dados, **Google Play Games** (leaderboards), Google como terceiro, audiência **13+**, contacto via listagem Play. |
| `src/app/math-rush/terms/page.tsx` | `/math-rush/terms` | Termos de serviço em inglês, mesmo padrão visual. Links internos com `next/link` para a outra rota. |

**Nota:** Os HTML estáticos em `math-rush/*.html` foram removidos para evitar duplicação; a fonte única é o Next.

**Links cruzados:** cada página linka à outra no topo e no rodapé (`/math-rush/privacy` ↔ `/math-rush/terms`).

## O que você precisa fazer antes de publicar as URLs

1. **Fazer deploy** do site Next (Vercel, etc.) ou do export estático, em domínio **HTTPS**.
2. Na Play Console, informar as URLs públicas, por exemplo:
   - `https://seu-dominio.com/math-rush/privacy`
   - `https://seu-dominio.com/math-rush/terms`
3. **Local:** com `npm run dev`, abrir `http://localhost:3000/math-rush/privacy` e `http://localhost:3000/math-rush/terms`.
4. **Contato:** se quiser um e‑mail explícito nas páginas (além da frase “use o contato da listagem Play”), edite as secções **11. Contact** (Privacy) e **12. Contact** (Terms) em `src/app/math-rush/*/page.tsx`.
5. **Jurisdição (opcional mas recomendável):** na secção **11. Governing law** dos Terms, ajustar com orientação jurídica se quiser país/foro fixos (o texto atual é genérico de propósito).

## Nome do produto nas páginas

- **EN:** Math Rush: Sphinx Challenge (equivalente ao subtítulo “Desafio da Esfinge”).
- Idade indicada nas páginas legais: **13+**.

## Reflexão (escalabilidade / manutenção)

As páginas no App Router partilham o mesmo stack do site (metadata SEO, `next/link`, deploy único). Para vários jogos, o padrão pode evoluir para componentes partilhados (layout legal, blocos reutilizáveis) com props por título/pacote. Manter constantes como `LAST_UPDATED` e listas de SDKs alinhadas ao binário publicado reduz divergência entre loja e site.

**Próximos passos sugeridos:** (1) adicionar o **package name** do app nas páginas se a política da loja exigir identificação explícita; (2) alinhar texto com quaisquer SDKs reais (Firebase, AdMob, etc.) se forem adicionados depois; (3) tradução PT opcional em páginas separadas se o público principal for Brasil e você quiser transparência bilíngue.
