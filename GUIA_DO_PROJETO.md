# Guia do Projeto - Bruno Realities Portfolio

Este documento serve como um mapa para entender a estrutura, o funcionamento visual e como realizar manutenções no seu portfólio.

---

## 1. Componentes em `components/` (O que fazem visualmente)

O projeto utiliza uma separação clara entre a camada 3D e a interface de usuário (UI).

- **`Scene.tsx`**: 
  - **O que faz**: É o "coração" 3D do site. Ele renderiza uma esfera orgânica (biomórfica) que flutua no fundo.
  - **Visual**: A esfera muda de posição, escala e nível de distorção conforme você rola a página. Ela usa um *shader* personalizado para parecer um material translúcido ou "vidro líquido".
  - **Interação**: Reage diretamente ao scroll do mouse.

- **`Overlay.tsx`**:
  - **O que faz**: Contém toda a interface de texto e conteúdo principal que fica "por cima" do 3D.
  - **Visual**: Inclui a seção Hero (Digital Bodies), o manifesto/statement, a lista de projetos (Archive) e a seção de contato.
  - **Interação**: Gerencia os cliques nos projetos para abrir os detalhes.

- **`ProjectDetail.tsx`**:
  - **O que faz**: É a tela que aparece quando você clica em um projeto no Archive.
  - **Visual**: Uma visualização em tela cheia com a imagem do projeto em destaque (em tons de cinza que ganham cor no hover), descrição detalhada e metadados.
  - **Interação**: Possui um botão de "Return_To_Archive" para voltar à tela principal.

- **`Effects.tsx`**:
  - **O que faz**: Gerencia o pós-processamento (filtros) do site.
  - **Visual**: Implementa o efeito CRT TV (linhas de varredura, ruído analógico, vinheta e aberração cromática).
  - **Interação**: Você pode ajustar a intensidade de cada efeito diretamente neste arquivo.

---

## 2. Conexão entre `App.tsx` e `index.tsx`

A estrutura de inicialização segue o padrão React moderno:

1.  **`index.tsx`**: É o ponto de entrada técnico. Ele busca o elemento `<div id="root">` no seu `index.html` e "injeta" o componente `<App />` dentro dele. Você raramente precisará mexer aqui.
2.  **`App.tsx`**: É o "maestro" do site. Ele:
    - Controla o estado global de scroll usando a biblioteca **GSAP**.
    - Decide se deve mostrar o `Overlay` (página principal) ou o `ProjectDetail` (detalhe de um projeto).
    - Passa o progresso do scroll para o componente `Scene`, permitindo que o 3D se mova em sincronia com o texto.
    - Contém a barra de navegação superior.

---

## 3. Configurações de Estilo, Cores e Textos

### Alterar Cores Principais
As cores globais estão definidas como variáveis CSS no arquivo **`index.html`**, dentro da tag `<style>`.
- Procure por `:root`:
  - `--cloud-dancer`: Cor de fundo (bege claro).
  - `--ink`: Cor principal dos textos e linhas (preto).
  - `--line`: Cor das linhas de grade sutis.

### Alterar Textos Principais
- **Textos da Home (Hero, Manifesto, Contato)**: Estão todos dentro do arquivo `components/Overlay.tsx`.
- **Lista de Projetos (Nomes, Descrições, Imagens)**: Também estão no `components/Overlay.tsx`, dentro da constante `archiveProjects`. É aqui que você adiciona novos projetos ou altera os existentes.
- **Navegação**: Os links do menu superior estão no `App.tsx`.

### Tipografia
As fontes (Inter, Cormorant Garamond) são carregadas via Google Fonts no `index.html`. Se quiser trocar a fonte, altere o link de importação e as classes `.font-display-bold` ou `.font-display-serif` no CSS do `index.html`.

---

> [!TIP]
> Para adicionar novas imagens, coloque-as na pasta `public/images/` e referencie-as no código como `/images/nome-da-imagem.png`.

> [!TIP]
> Para testar outros efeitos de pós-processamento, você pode importar novos componentes (como `Bloom`, `DotScreen`, `Glitch`) de `@react-three/postprocessing` no arquivo `Effects.tsx` e adicioná-los dentro do `EffectComposer`.
