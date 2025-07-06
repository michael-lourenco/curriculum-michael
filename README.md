# Portfólio Pessoal - Michael Lourenço

Este repositório contém o código-fonte do meu portfólio profissional, desenvolvido utilizando **Next.js 14** com App Router. O objetivo deste projeto é apresentar minhas informações profissionais, experiências e habilidades de forma interativa e acessível.

## 🚀 Tecnologias Utilizadas

- **Next.js 14**: Framework React com App Router para aplicações web modernas
- **TypeScript**: Linguagem com tipagem estática para maior segurança e produtividade
- **Tailwind CSS**: Framework CSS utilitário para design responsivo e moderno
- **React Icons**: Biblioteca de ícones para React
- **ts-pattern**: Biblioteca para pattern matching em TypeScript
- **PostCSS**: Ferramenta para transformar CSS com plugins

## 📁 Estrutura do Projeto

O projeto segue a estrutura do Next.js 14 com App Router:

```
src/
├── app/
│   ├── layout.tsx          # Layout base com metadados e fontes
│   ├── page.tsx            # Página principal do portfólio
│   ├── globals.css         # Estilos globais
│   └── fonts/              # Fontes personalizadas (Geist)
├── components/             # Componentes reutilizáveis
│   ├── Header.tsx          # Cabeçalho com foto e informações básicas
│   ├── ContactInfo.tsx     # Informações de contato e redes sociais
│   ├── ProfessionalSummary.tsx # Resumo profissional
│   ├── Skills.tsx          # Habilidades técnicas
│   ├── Experience.tsx      # Experiência profissional
│   ├── Education.tsx       # Formação acadêmica
│   ├── Languages.tsx       # Idiomas
│   ├── PersonalProjects.tsx # Projetos pessoais
│   ├── ScrollToTop.tsx     # Botão de voltar ao topo
│   └── Icon.tsx            # Componente de ícone reutilizável
└── public/
    └── profile.jpg         # Foto de perfil
```

## ✨ Funcionalidades

- **Design Responsivo**: Layout adaptável para diferentes dispositivos
- **Navegação Suave**: Botão de voltar ao topo para melhor experiência
- **SEO Otimizado**: Metadados completos para melhor indexação
- **Fontes Personalizadas**: Uso das fontes Geist para tipografia moderna
- **Ícones Interativos**: Links para GitHub e LinkedIn com hover effects
- **Informações Profissionais**: Seções organizadas para experiência, educação, habilidades e projetos

## 🛠️ Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/michael-lourenco/curriculum-michael-cursor.git
   ```

2. **Acesse o diretório:**
   ```bash
   cd curriculum-michael-cursor
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

4. **Execute em modo de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

## 📦 Scripts Disponíveis

- `npm run dev` - Executa o servidor de desenvolvimento com Turbo
- `npm run build` - Gera a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## 🎨 Personalização

Para personalizar este portfólio para seu uso:

1. **Informações Pessoais**: Atualize os dados em `src/components/`
2. **Foto de Perfil**: Substitua `public/profile.jpg`
3. **Cores e Estilos**: Modifique `tailwind.config.ts` e `src/app/globals.css`
4. **Metadados**: Atualize as informações em `src/app/layout.tsx`

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- Dispositivos móveis
- Tablets
- Desktops
- Diferentes resoluções de tela

## 🔗 Links

- **Site**: [michaellourenco.com](https://michaellourenco.com)
- **GitHub**: [michael-lourenco](https://github.com/michael-lourenco)
- **LinkedIn**: [michael-lourenco](https://www.linkedin.com/in/michael-lourenco/)
- **Email**: kontempler@gmail.com

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Sinta-se à vontade para usar como base para seu próprio portfólio.

---

Desenvolvido com ❤️ por Michael Lourenço
