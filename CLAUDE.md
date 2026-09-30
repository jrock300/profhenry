# CLAUDE.md — Site do Prof. Henry Jansen (MatemáticaMC)

Funil de vendas estático (HTML + CSS + JS puros, sem build) para os
cursos de matemática do Prof. Henry Jansen, voltados aos vestibulares do
Paraná. A compra acontece na Kiwify; o site leva o aluno até lá.

Esta é a **versão 2**: nova identidade visual ("o caderno do
professor"). A versão anterior está na pasta vizinha `../henryt` e serve
de referência de conteúdo.

Leia também: `README.md` (conteúdo, preços, checkout) e `DESIGN.md`
(identidade visual).

## Rodar localmente

Abra o `index.html` direto no navegador — não precisa de servidor, e
funciona igual em Chrome, Firefox e Safari. O preload das fontes é
criado por um script no `<head>` só quando a página vem de `http(s)`:
em `file://` ele falharia por CORS e o Safari ficaria sem as fontes.

Não há dependências, build nem testes automatizados. As ferramentas
Python em `ferramentas/` são opcionais (só para manutenção).

## Estrutura

```
index.html               Landing (hub): apresenta o professor e compara os 2 cursos
extensivo-mais-c.html    Página de vendas do Extensivo +C (produto completo)
extensivo-mmc.html       Página de vendas do Extensivo MMC (versão essencial)
src/css/estilo.css       CSS único das três páginas (tokens no :root)
src/js/script.js         JS único das três páginas
src/fonts/               4 fontes woff2 auto-hospedadas + LICENCAS.txt
src/img/                 perfil.jpg (logo), foto_de_perfil (recorte), alunos_aprovados/
linknabio/               Página de link na bio — AUTOCONTIDA (CSS, JS, fontes e avatar próprios)
ferramentas/             gerar_desenhos.py, verificar_copy.py
```

## Regras que não podem ser quebradas

1. **A copy é final.** Não altere nenhum texto visível, preço, link,
   `alt`, `aria-label`, título ou meta description sem pedido explícito.
   Isso inclui pontuação e acentos. Depois de mexer em HTML, confira:

   ```bash
   pip install beautifulsoup4
   python ferramentas/verificar_copy.py \
     ../henryt/index.html index.html \
     ../henryt/extensivo-mais-c.html extensivo-mais-c.html \
     ../henryt/extensivo-mmc.html extensivo-mmc.html \
     ../henryt/LinkNaBio/index.html linknabio/index.html
   ```

   O resultado tem que ser `OK`. As únicas diferenças esperadas são
   avisos em `meta`: o `theme-color` e, na link na bio, o `og:url`
   (a pasta virou `linknabio/`, em minúsculas, para a URL funcionar em
   servidor que diferencia maiúsculas). O preload das fontes é criado
   por script, então não aparece em `links_head`.
   Se a copy for mudada de propósito, a referência deixa de valer — avise.
2. **Preço: "ou", nunca "em até".** 12x não é igual ao valor à vista
   (há juros). Ver README.
3. **Links da Kiwify** terminam em `?region=br`. Não remova.
4. **Nada de CDN.** Fontes, scripts e imagens ficam no projeto.
   Única exceção: o Cloudflare Web Analytics
   (`static.cloudflareinsights.com/beacon.min.js`), no fim do `<body>`
   das 4 páginas. O Cloudflare desaconselha servir uma cópia própria.
5. **Decoração é `aria-hidden="true"`.** Fundo, adesivos, reta numérica,
   operadores "+" da credibilidade — tudo que é enfeite fica fora da
   leitura de tela.

## Regras de design (resumo do DESIGN.md)

- Use só os tokens do `:root` (`--tinta`, `--verde`, `--marca-texto`,
  `--lousa`, `--borda`, `--sombra`, `--esp-*`...). Não escreva cor solta.
- Contorno `var(--borda)` + sombra dura sem desfoque. Nunca
  `box-shadow` com blur em cartão ou botão, nunca `backdrop-filter`.
- Botão principal: verde no papel, **amarelo dentro de `.lousa`** e do
  `.curso-cartao--destaque`.
- Marca-texto (`.texto-marcado`) só em 1 palavra curta por título.
- Mobile-first. Breakpoints: 400, 520, 559/560, 700, 768, 860 (menu),
  880 (duas colunas). Sem rolagem horizontal em 360px.
- Animação só em `transform`/`opacity`, e tudo desligado em
  `prefers-reduced-motion`.

## Blocos repetidos entre as páginas

Não há templates: estes blocos estão **copiados** em `index.html`,
`extensivo-mais-c.html` e `extensivo-mmc.html`. Mudou um, replique nos
três.

| Bloco | Observação |
|---|---|
| Fundo (`.fundo-matematico`, `.fundo-simbolos`, `.fundo-grao`) | idêntico |
| Cabeçalho `.cabecalho` | idêntico, **exceto** os links do `<nav>` e o botão (`#cursos` na landing, `#matricula` nos cursos) |
| Figura do hero `.hero-figura` (arco + parábola + adesivos) | idêntica |
| Carrossel `#carrossel-alunos` (13 alunos) | idêntico |
| Instituições `.instituicoes` | idêntico |
| Garantias `.garantias-grade` | idêntico |
| Rodapé `.rodape` | idêntico |
| Cloudflare Web Analytics (fim do `<body>`) | idêntico, **também na `linknabio/`** — mesmo token |

A `linknabio/` tem CSS próprio (mesmos tokens, versão enxuta). Mudança
de token no site → replique em `linknabio/src/css/estilo.css`.

## O que o JavaScript espera do HTML

`src/js/script.js` procura estes seletores (e ignora a página se não
existirem):

- Menu: `#nav-abrir`, `#nav-links` (classe `.aberto`), fecha acima de 860px
- Entrada em cascata: `.anim-cascata` → recebe `.visivel`
- Onda de clique: `.botao`
- Carrossel: `#carrossel-alunos`, `#carrossel-pontos`,
  `.carrossel-seta--anterior`, `.carrossel-seta--proxima`
  (o passo usa `offsetWidth` por causa da inclinação dos cartões)
- FAQ: `.duvida`, `.duvida-pergunta` (classe `.aberta`, `aria-expanded`)
- Ano: `[data-ano]`

## Fundo matemático e fontes

- As fórmulas do fundo (`--desenho-*`) são **geradas**. Não edite o
  bloco entre `/* <desenhos> */` e `/* </desenhos> */` à mão:

  ```bash
  pip install fonttools brotli
  python ferramentas/gerar_desenhos.py   # atualiza os dois CSS
  ```

- `src/fonts/zen-kurenaido-matematica.woff2` é um **subconjunto** (só
  símbolos matemáticos, dígitos e a–z/A–Z sem acento). Para incluir um
  glifo novo é preciso a fonte completa:

  ```bash
  npm install @fontsource/zen-kurenaido    # numa pasta temporária
  # junte os .woff2 400 que contêm os caracteres desejados com
  # fontTools (subset + merge) e salve com o mesmo nome
  ```

  Depois copie o arquivo também para `linknabio/src/fonts/`.

## Estado atual e o que falta para concluir

Feito:

- [x] Nova identidade aplicada às 3 páginas + link na bio
- [x] Copy, preços, links e imagens idênticos à versão anterior
      (verificado com `ferramentas/verificar_copy.py`)
- [x] Fontes auto-hospedadas, fundo matemático redesenhado à mão
- [x] Responsivo conferido em 390px e 1440px; menu, carrossel e FAQ
      testados
- [x] Link do PDF de Análise Combinatória (linknabio) conferido em
      26/09/2026: abre sem login.
- [x] Testado em Chromium, Firefox e WebKit (Safari) pelo Playwright,
      abrindo por `file://`: 4 páginas × 9 larguras (320 a 1920px). Sem
      rolagem horizontal; menu, FAQ, carrossel e âncoras ok. Corrigido: o
      preload das fontes deixava o Safari sem Bricolage/Figtree em
      `file://` (agora é criado por script só em `http(s)`).
- [x] Lighthouse no celular (26/09/2026, sem compressão): Acessibilidade
      100 e Boas práticas 100 nas 4 páginas; SEO 92 só por falta de
      `robots.txt` no ambiente de teste; Desempenho 76 (landing), 80
      (cursos), 87 (linknabio). Corrigido: contraste do subtítulo do botão
      em destaque da linknabio (agora `--verde-claro`, 4,63:1).

Falta (antes de publicar):

- [ ] Trocar `seudominio.com.br` pelo domínio real (3 ocorrências em cada
      página do site, 2 na linknabio — uma delas é o comentário "ANTES DE
      PUBLICAR"). Aproveitar para deixar `og:image` e `twitter:image` com
      URL absoluta — redes sociais não leem caminho relativo.
- [ ] Conferir acentos dos nomes dos alunos e a sigla "PUCPR" (README).
- [ ] Confirmar autorização de uso das fotos/nomes dos alunos.
- [ ] Olhar num iPhone de verdade. O WebKit do Playwright no Windows não
      desenha os pesos da fonte variável (o negrito da Figtree some); no
      Safari real deve estar certo, mas vale confirmar.
- [ ] Rodar o Lighthouse de novo no domínio publicado (com compressão
      e HTTP/2 o desempenho deve subir).
- [ ] (Opcional, mexe em `src`/`srcset` — precisa de autorização)
      Imagens responsivas: fotos dos alunos (512px exibidas a ~250px),
      foto do professor e logo do cabeçalho (`perfil.jpg` 38 KB exibido a
      42px; existe `perfil.webp` de 14 KB).
- [ ] (Opcional) `git init` nesta pasta para versionar a v2.
