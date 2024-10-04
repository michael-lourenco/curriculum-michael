# Currículo Pessoal em Next.js

Este repositório contém o código-fonte do meu currículo, desenvolvido utilizando **Next.js**. O objetivo deste projeto é apresentar minhas informações profissionais e experiências de forma interativa e acessível. 

## Tecnologias Utilizadas

- **Next.js**: Framework React para aplicações web modernas com renderização no lado do servidor e funcionalidades avançadas de roteamento.
- **TypeScript**: Linguagem com tipagem estática opcional que melhora a segurança e a produtividade no desenvolvimento.
- **Tailwind CSS**: Framework CSS que facilita a criação de layouts responsivos e modernos.
- **PostCSS**: Ferramenta para transformar o CSS com plugins, usada para otimizar o estilo final.

## Estrutura do Projeto

Este projeto segue a estrutura recomendada pelo Next.js, utilizando o **App Router** e **TypeScript**:

```
src/
├── app/
│   ├── components/    # Componentes reutilizáveis do currículo
│   ├── layout.tsx     # Layout base para todas as páginas
│   ├── page.tsx       # Página inicial do currículo
│   ├── pages/         # Outras páginas e seções do currículo
│   └── styles/        # Estilos globais
├── public/            # Arquivos estáticos
├── types/             # Definições de tipos TypeScript
└── utils/             # Funções utilitárias
```

## Funcionalidades

- Apresentação de informações profissionais como experiência, formação acadêmica, habilidades técnicas e projetos pessoais.
- Layout totalmente responsivo para diferentes dispositivos, desde smartphones até desktops.
- Links interativos para GitHub, LinkedIn e contato por email.
- Organização modular do código com componentes reutilizáveis.


## Como Executar Localmente

Siga os passos abaixo para rodar este projeto localmente:

1. Clone este repositório:
```
   git clone https://github.com/seu-usuario/meu-curriculo-nextjs.git
```
2. Acesse o diretório do projeto:
```
   cd meu-curriculo-nextjs
```

3. Instale as dependências:
```
   yarn install
```

4. Execute o projeto em modo de desenvolvimento:
```
   yarn dev
```

5. Acesse no navegador:
```
   http://localhost:3000
```

## Como Personalizar

Se você deseja criar seu próprio currículo a partir deste projeto, você pode personalizar facilmente o conteúdo em:

- `src/app/components`: Componentes reutilizáveis do currículo.
- `src/app/page.tsx`: Página principal que carrega as seções do currículo.
- `src/app/pages`: Outras páginas e seções adicionais.

Sinta-se à vontade para modificar o design, conteúdo e estrutura conforme necessário.

## Contribuindo

Sugestões e contribuições são bem-vindas! Sinta-se à vontade para abrir uma Issue ou enviar um Pull Request com melhorias ou correções.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais informações.
