# Site — Prof. Henry Jansen (MatemáticaMC)

Site estático em HTML, CSS e JavaScript puros. Não precisa de build,
servidor de aplicação nem dependências: basta subir os arquivos.

> **Versão 2 — identidade "O caderno do professor".** O layout foi
> refeito do zero; a copy, os preços, os links e as imagens são os
> mesmos da versão anterior (pasta `henryt`). O guia visual completo
> está em [`DESIGN.md`](DESIGN.md).

## Estrutura

```
index.html                 Landing principal
extensivo-mais-c.html      Página de vendas do Extensivo +C
extensivo-mmc.html         Página de vendas do Extensivo MMC
src/css/estilo.css         Estilo único das três páginas
src/js/script.js           Script único das três páginas
src/fonts/                 Fontes auto-hospedadas (woff2) + licenças
src/img/                   Imagens (logo, foto do professor, alunos)

linknabio/                 Página de link na bio (Instagram)
  index.html
  src/css/estilo.css       Autocontido — não depende do CSS do site
  src/js/script.js
  src/fonts/               Cópia das fontes (a pasta pode ir sozinha)
  src/img/                 Cópia do avatar (perfil.jpg / .webp)

ferramentas/
  gerar_desenhos.py        Gera as fórmulas do fundo dentro do CSS
  verificar_copy.py        Confere se a copy continua igual à original

DESIGN.md                  Guia da identidade visual
CLAUDE.md                  Instruções para continuar no Claude Code
```

## Antes de publicar — o que falta preencher

### 1. Alunos aprovados — conferir acentos

Os 13 cartões já estão preenchidos. Nome, curso e instituição foram
extraídos do nome de cada arquivo em `src/img/alunos_aprovados/`, no
padrão `nome_curso_instituicao.png`.

Dois pontos que **foram inferidos** e valem conferência:

- **Acentos.** O nome do arquivo não os tem, então está escrito "Gustavo
  Leão", "João Gabriel", "Engenharia Química", "Ciência da Computação",
  "Mecatrônica", "Administração". Sobrenomes menos óbvios ficaram como
  no arquivo — "Swiech", "Delaterra Ignes", "Perugini".
- **`..._medicina_puc.png` virou "PUCPR"**, para bater com a lista de
  instituições do site. Se for outra PUC, corrija.

> **Atenção:** as fotos e os nomes são de pessoas reais. Confirme que há
> autorização de uso com finalidade comercial antes de colocar no ar.

### 2. Domínio

Procure por `seudominio.com.br` (3 ocorrências por arquivo) e troque pelo
endereço real. Isso afeta a tag `canonical` e a pré-visualização ao
compartilhar o link (Open Graph).

## Preços

| Curso | À vista | Parcelado |
|---|---|---|
| Extensivo +C | R$ 1.398,00 | 12x de R$ 144,59 |
| Extensivo MMC | R$ 1.098,00 | 12x de R$ 113,56 |

Formas de pagamento: cartão, boleto ou Pix.

**Os dois valores não são equivalentes.** 12x de R$ 144,59 soma
R$ 1.735,08, contra R$ 1.398,00 à vista — são os juros do parcelamento.
Por isso o texto do site usa sempre "**ou** R$ 1.398,00 à vista", nunca
"em até 12x", que daria a entender o mesmo total.

Onde cada valor aparece (4 lugares por curso):

| Onde | Arquivo |
|---|---|
| Cartão comparativo | `index.html`, seção Cursos |
| Linha de apoio do hero | página do curso |
| Caixa de matrícula (acima do botão) | página do curso |
| FAQ "Quanto custa e como posso pagar?" | página do curso |

**Para alterar um preço**, procure pelo valor antigo nos três HTML — ele
aparece por extenso em todos os pontos, sem variável central.

A página de link na bio não exibe preço. Se quiser incluir, o subtítulo
de cada botão aceita até ~30 caracteres.

## Como funciona a compra

Cada página de curso termina numa caixa com o preço e **um botão** que
leva direto ao checkout da Kiwify. Não há formulário intermediário.

| Página | Produto | Link do botão |
|---|---|---|
| `extensivo-mais-c.html` | Extensivo +C | `https://pay.kiwify.com.br/rl4tUCF?region=br` |
| `extensivo-mmc.html` | Extensivo MMC | `https://pay.kiwify.com.br/UJjDNMg?region=br` |

Para trocar o link de um produto, altere o `href` desse botão — ele está
na seção `id="matricula"`, no fim do arquivo.

O `?region=br` força o checkout brasileiro, com campo de CPF e
parcelamento. Sem ele a Kiwify tenta detectar o país, e alguém com VPN
ou viajando cairia na versão internacional, sem parcelamento.

### Por que não há mais formulário de pré-checkout

Existia um formulário que coletava nome, e-mail, CPF e telefone e
repassava tudo para a Kiwify pela URL (ela aceita os parâmetros `name`,
`email`, `cpf`, `phone` e `region`).

Foi removido porque o ganho não se sustentava: a Kiwify **não tem
parâmetro para "Confirmar e-mail"**, então o aluno tinha que redigitar
esse campo de qualquer jeito — e ficava com a impressão de ter
preenchido o mesmo cadastro duas vezes. Uma etapa a mais antes do
pagamento custa mais conversão do que os quatro campos economizados
devolvem.

Se um dia quiser trazer de volta, o código está no histórico da pasta
antiga (`henryt`); o que ele fazia era montar
`https://pay.kiwify.com.br/CODIGO?name=...&email=...&cpf=...&phone=...&region=br`
com CPF e telefone só em dígitos, telefone com DDD e sem o +55.

## Link na bio

A pasta `linknabio/` é a página para o link do perfil no Instagram.
Publicada junto com o site, ela fica em `seudominio.com.br/linknabio/`.

Ela aponta para as páginas do site por caminho relativo
(`../extensivo-mais-c.html`), então **não** mova a pasta para fora da
raiz do projeto sem corrigir esses links.

O CSS, o JS e as fontes dela são autocontidos, e o avatar está duplicado
dentro de `linknabio/src/img/` (41 KB). Foi de propósito: assim a pasta
também pode ser publicada sozinha, num subdomínio ou serviço separado,
sem arrastar o site inteiro junto. Se fizer isso, os quatro links
internos precisam virar URLs absolutas.

Os links atuais, em ordem:

1. **Extensivo +C** (em destaque, verde cheio) → página do curso
2. **Extensivo MMC** → página do curso
3. **Comparar os dois cursos** → landing principal
4. **Análise Combinatória** → PDF gratuito no Google Drive

> O link do PDF veio da versão anterior da página. Vale conferir se
> ainda está valendo antes de publicar.

Para trocar, adicionar ou reordenar um link, edite o bloco
`<nav class=links>` no `index.html`. Cada botão é um `<a>` com
ícone, título, subtítulo e seta — é só copiar um dos existentes.

**Limite de texto:** o subtítulo trunca com reticências acima de ~30
caracteres na largura de celular. Os atuais cabem.

## Chamadas para ação (CTAs)

A página de curso tem ~11 telas de celular. Antes havia só dois botões
de compra — o do hero e o da matrícula — com **8 telas de rolagem** entre
eles. Quem decidia comprar no meio do caminho tinha que procurar.

Hoje cada página de curso tem 5 pontos de compra:

| Onde | Destino |
|---|---|
| Barra de navegação (fixa no topo) | `#matricula` |
| Hero | `#matricula` |
| Fim de "O +C é pra você?" | `#matricula` |
| Fim de "Tudo o que está incluso" | `#matricula` |
| Fim de "Eles sentaram na cadeira da prova" | `#matricula` |
| Caixa de matrícula | checkout da Kiwify |

Maior distância sem botão: **~3,5 telas** (era 8).

Na landing, a faixa fica no fim de "Alunos aprovados" e aponta para
`#cursos`.

Cada uma é só o botão, centralizado, na classe `.cta-faixa` — sem frase
de apoio nem cartão em volta, para não competir com o texto da seção que
acabou de terminar. No celular o botão ocupa a largura toda.

Para adicionar outra, copie um bloco `.cta-faixa` para o fim do
`.container` da seção desejada.

## Testando localmente

Abra o `index.html` direto no navegador — não precisa de servidor.
Funciona em Chrome, Edge, Firefox e Safari, sem erro no console.

Por isso o `<link rel="preload">` das fontes não está escrito no HTML:
um script curto no `<head>` só o cria quando a página vem de `http(s)`.
Aberta pelo `file://`, a origem é "null", o preload falha por CORS e o
Safari não tenta de novo pelo CSS — títulos e texto ficariam na fonte
do sistema. No site publicado o preload continua funcionando normal.

## Publicação

Suba os arquivos como estão para qualquer hospedagem estática
(Netlify, Vercel, GitHub Pages, Hostinger, etc.). Não há etapa de build.
A pasta `ferramentas/` não precisa ir para o ar.

## Notas técnicas

- **Sem CDN.** Nenhuma fonte, biblioteca ou script de terceiros. As
  quatro fontes ficam em `src/fonts/` (≈120 KB no total) e são todas
  OFL — a licença está em `src/fonts/LICENCAS.txt`. A dos títulos e a
  do texto são pré-carregadas no `<head>` quando a página vem de
  `http(s)` (ver "Testando localmente").
- **Imagens.** A foto do professor é servida em WebP (84 KB) com fallback
  em PNG. O original de 1,5 MB não é usado.
- **Fotos dos alunos.** Em `src/img/alunos_aprovados/`, cada aluno tem
  dois arquivos, ambos **512×512**: o `.webp` (44–60 KB, é o que o
  navegador usa) e o `.jpg` (fallback, só entra se o WebP falhar).

  **Os dois precisam existir.** O HTML usa `<picture>`, e se você trocar
  só o `.webp` o fallback continua apontando para a foto antiga — ou
  para um arquivo que não existe mais.

  **Trocar a foto de um aluno** (o arquivo pode vir em qualquer tamanho
  quadrado):

  ```bash
  cd src/img/alunos_aprovados
  ffmpeg -i NOVA.png -vf scale=512:512 -c:v libwebp -quality 82 nome_curso_instituicao.webp -y
  ffmpeg -i NOVA.png -vf scale=512:512 -q:v 4 nome_curso_instituicao.jpg -y
  ```

  **Adicionar um aluno novo:** rode os dois comandos acima com o nome no
  padrão `nome_curso_instituicao`, depois copie um
  `<article class="aluno-cartao">` existente nos três HTML, trocando o
  nome do arquivo, a sigla, o nome e o curso.
- **Carrossel.** Acima de 8 páginas os pontinhos viram um contador
  ("3 / 13"). Os cartões são polaroides levemente tortas; por isso o
  passo da rolagem usa `offsetWidth` (largura de layout), que não muda
  com a rotação.
- **Se o JavaScript falhar**, a página continua legível: o conteúdo nasce
  visível e só é escondido para animar quando o script confirma que está
  ativo (classe `com-js` no `<html>`).
- **Movimento reduzido.** Quem tem `prefers-reduced-motion` ativado no
  sistema não recebe nenhuma animação.
- **Fundo matemático.** As fórmulas e figuras (Bhaskara, Pitágoras, a
  parábola no plano cartesiano, o círculo, o ângulo, sen²θ + cos²θ = 1 e
  o somatório da PA) são SVG embutido em `data:` URI, em três planos de
  profundidade — `.camada--longe`, `--meio` e `--perto`. Cada plano é
  **um** elemento composto carregando vários desenhos, então a animação
  roda inteira no compositor.

  O texto das fórmulas é "escrito à mão" (fonte Zen Kurenaido) e
  convertido em contorno pelo `ferramentas/gerar_desenhos.py`, porque SVG
  usado como background não enxerga as fontes da página. O script grava
  as variáveis `--desenho-*` entre os marcadores `/* <desenhos> */` dos
  dois CSS. Só rode de novo se mudar um desenho:

  ```bash
  pip install fonttools brotli
  python ferramentas/gerar_desenhos.py
  ```

  Para ajustar a intensidade, mexa na `opacity` de cada camada; para
  reposicionar, em `background-position`. O plano cartesiano é ocultado
  abaixo de 700px, onde não há largura para a parábola ser lida.
- **Calibragem do fundo.** Grade do papel em `rgba(11, 122, 54, 0.07)`
  (linha fina a cada 28px) e `0.12` (a cada 140px); símbolos
  `.fundo-simbolos` em `0.3`; camadas em `0.17` / `0.22` / `0.28`
  (longe / meio / perto). Os painéis `.secao--painel` usam papel
  pontilhado, **sem** `backdrop-filter` — o blur deixava as fórmulas
  borradas ao atravessar o painel.
- **Logos das universidades.** São marcas registradas e não estão
  disponíveis como arquivo, então as instituições aparecem como placas
  tipográficas (com a bolinha de gabarito). Se houver autorização e os
  arquivos, dá para trocar por imagens.
