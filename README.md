# Portfólio Profissional - Michael Lourenço

Este repositório contém o código-fonte do meu portfólio profissional, desenvolvido utilizando **Next.js 14** com App Router. O objetivo deste projeto é apresentar minhas informações profissionais, experiências e habilidades de forma interativa e acessível.

## 🚀 Tecnologias Utilizadas

- **Next.js 14.2.14**: Framework React com App Router para aplicações web modernas
- **TypeScript**: Linguagem com tipagem estática para maior segurança e produtividade
- **Tailwind CSS**: Framework CSS utilitário para design responsivo e moderno
- **React Icons**: Biblioteca de ícones para React
- **ts-pattern**: Biblioteca para pattern matching em TypeScript
- **PostCSS**: Ferramenta para transformar CSS com plugins

## 📁 Estrutura do Projeto

O projeto segue a estrutura do Next.js 14 com App Router e componentes modernos:

```
src/
├── app/
│   ├── layout.tsx          # Layout base com metadados e fontes
│   ├── page.tsx            # Página principal do portfólio
│   ├── globals.css         # Estilos globais e sistema de cores
│   └── fonts/              # Fontes personalizadas (Geist)
├── components/             # Componentes reutilizáveis
│   ├── Navigation.tsx      # Menu de navegação fixo e responsivo
│   ├── Header.tsx          # Seção hero com foto e CTA buttons
│   ├── ContactInfo.tsx     # Informações de contato e redes sociais
│   ├── ProfessionalSummary.tsx # Resumo profissional com métricas
│   ├── Skills.tsx          # Habilidades técnicas organizadas
│   ├── Experience.tsx      # Experiência profissional com timeline
│   ├── Education.tsx       # Formação acadêmica e certificações
│   ├── Languages.tsx       # Idiomas com barras de progresso
│   ├── Portifolio.tsx      # Portfólio de projetos com modal
│   ├── ScrollToTop.tsx     # Botão de voltar ao topo
│   └── Icon.tsx            # Componente de ícone reutilizável
└── public/
    ├── profile.jpg         # Foto de perfil
    └── projects/           # Imagens dos projetos
```

## ✨ Funcionalidades

### 🎨 Design e UX
- **Sistema de Cores Moderno**: Paleta profissional com variáveis CSS
- **Layout Responsivo**: Adaptável para todos os dispositivos
- **Animações Suaves**: Transições e efeitos de hover
- **Tipografia Melhorada**: Hierarquia visual clara
- **Cards Interativos**: Efeitos de elevação e hover

### 🧭 Navegação
- **Menu Fixo**: Navegação sempre visível no topo
- **Scroll Suave**: Navegação entre seções com offset
- **Indicador Ativo**: Destaque da seção atual
- **Menu Mobile**: Versão hamburger responsiva
- **Navegação por Teclado**: Suporte completo para acessibilidade

### 📱 Responsividade
- **Mobile-First**: Design otimizado para dispositivos móveis
- **Breakpoints Inteligentes**: Adaptação automática
- **Touch-Friendly**: Interface otimizada para toque
- **Performance**: Carregamento otimizado

### 🎯 Seções Principais
1. **Hero Section**: Apresentação com CTA buttons
2. **Resumo Profissional**: Métricas e especializações
3. **Skills**: Habilidades técnicas organizadas por categoria
4. **Experiência**: Timeline profissional com projetos
5. **Educação**: Formação acadêmica e certificações
6. **Idiomas**: Proficiência com barras de progresso
7. **Portfólio**: Projetos com modal interativo

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

## 🎨 Sistema de Design

### Cores Principais
- **Primary**: #2563eb (Azul profissional)
- **Secondary**: #7c3aed (Roxo para destaque)
- **Accent**: #10b981 (Verde para sucesso)
- **Neutral**: #1f2937 (Cinza escuro)

### Componentes Base
- **Cards**: Wrapper com sombras e hover effects
- **Botões**: Estilos primário, secundário e accent
- **Animações**: fade-in-up, slide-up, fade-in
- **Tipografia**: Hierarquia H1-H4 com espaçamentos

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- **Dispositivos móveis** (320px+)
- **Tablets** (768px+)
- **Desktops** (1024px+)
- **Telas grandes** (1280px+)

## 🔗 Links

- **Site**: [michaellourenco.com](https://michaellourenco.com)
- **GitHub**: [michael-lourenco](https://github.com/michael-lourenco)
- **LinkedIn**: [michael-lourenco](https://www.linkedin.com/in/michael-lourenco/)
- **Email**: kontempler@gmail.com

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Sinta-se à vontade para usar como base para seu próprio portfólio.

---

Desenvolvido por Michael Lourenço
