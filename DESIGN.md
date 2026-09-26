# Identidade visual — "O caderno do professor"

Guia da identidade do site do Prof. Henry Jansen (MatemáticaMC).
Tudo o que está aqui existe como variável ou classe em
`src/css/estilo.css` — use sempre os tokens, nunca a cor ou a medida
solta.

## A ideia

O Henry é divertido, mas o trabalho é sério: é vestibular. A página
junta os dois assim:

- **A estrutura é séria.** Grade firme, alinhamento rígido, hierarquia
  forte de títulos, muito respiro, preço e garantias sempre claros.
- **A graça fica nos detalhes.** É o caderno de quem estuda com ele:
  papel milimetrado, marca-texto amarelo, fita adesiva, fórmulas
  escritas à mão, bolinha de gabarito, polaroides dos aprovados,
  correção de prova (certinho verde, xis vermelho).
- **O traço vem do logo.** O logo do MMC é um desenho com contorno preto
  grosso e sombra dura. A interface usa a mesma linguagem: contorno de
  2px em tinta e sombra "carimbada" sem desfoque (`5px 5px 0`).
- **A lousa marca as decisões.** Os blocos em verde-quadro aparecem só
  onde a pessoa decide: o cartão do +C, o banner "do zero", a chamada
  final, a matrícula e o rodapé.

## Cores

| Token | Hex | Uso |
|---|---|---|
| `--papel` | `#fbf8f1` | Fundo da página (com a grade milimetrada) |
| `--papel-escuro` | `#f3eee1` | Painéis (papel pontilhado) |
| `--folha` | `#fffefa` | Cartões, botões secundários |
| `--tinta` | `#14261c` | Texto, contornos e sombras |
| `--tinta-suave` | `#3d4f44` | Texto corrido |
| `--tinta-fraca` | `#5d6d63` | Legendas, texto de apoio |
| `--verde` | `#0b7a36` | Marca; botão principal; destaques |
| `--verde-escuro` | `#075c28` | Ícones sobre verde-claro |
| `--verde-claro` | `#dff1e4` | Fundo de ícones e checks |
| `--marca-texto` | `#ffd84a` | Marca-texto; botão principal **na lousa** |
| `--caneta` | `#d6452a` | Só correção ("não é pra você") e o bloco Reta final |
| `--lousa` | `#173f2f` | Blocos de decisão |
| `--lousa-escura` | `#0f2f22` | Rodapé |
| `--giz` | `#f6f4ec` | Texto sobre a lousa |

Regras:

- **Verde é ação.** O botão principal é verde no papel e **amarelo na
  lousa** (verde sobre verde sumiria).
- **Amarelo é destaque, com parcimônia.** Uma palavra marcada por
  título, no máximo. Não pinte frases inteiras.
- **Vermelho não é erro nem urgência.** É a caneta do professor
  corrigindo. Não use em botão.

## Tipografia

| Papel | Fonte | Onde |
|---|---|---|
| Títulos, botões, números, preço | **Bricolage Grotesque** 700–800 | `--fonte-titulo` |
| Texto corrido | **Figtree** 400–700 | `--fonte-base` |
| Anotação à mão | **Caveat** 700 | `--fonte-mao` — etiquetas de seção, "12x de", @handle |
| Fórmulas e símbolos | **Zen Kurenaido** | `--fonte-conta` — só símbolos matemáticos |

- Títulos com `letter-spacing: -0.03em` e `text-wrap: balance`.
- A Zen Kurenaido está **subconjuntada**: só tem dígitos, letras
  latinas sem acento e os símbolos matemáticos (π Σ Δ θ √ ∞ ∫ ∂ ± × ÷ ²
  etc.). Não use para texto em português. Se precisar de um símbolo novo,
  gere o subconjunto de novo (ver `CLAUDE.md`).
- Caveat só em trechos curtos (até ~5 palavras). Nunca em parágrafo.

## Forma

| Token | Valor |
|---|---|
| `--borda` | `2px solid var(--tinta)` |
| `--sombra-p` | `3px 3px 0` — botões pequenos, chips, adesivos |
| `--sombra` | `5px 5px 0` — cartões |
| `--sombra-g` | `8px 8px 0` — destaque (cartão +C, arco do hero, lousas) |
| `--raio-cartao` | `22px` |
| `--raio-pequeno` | `12px` |

Botões são pílulas (`border-radius: 999px`). No hover o elemento
"descola" do papel (`translate(-2px, -2px)` + sombra maior); no clique é
apertado contra ele (`translate(2px, 2px)` + sombra mínima).

## Componentes

| Componente | Classe | Observação |
|---|---|---|
| Etiqueta de seção | `.secao-etiqueta` | Caveat verde com setinha desenhada; amarela na lousa |
| Palavra marcada | `.texto-marcado` | Marca-texto com pontas irregulares, "pintado" ao entrar na tela. Só para palavras curtas (usa `nowrap`) |
| Trecho destacado | `.texto-destaque` | Verde com sublinhado amarelo grosso; funciona com quebra de linha |
| Botões | `.botao--primario`, `--secundario`, `--pequeno`, `--grande`, `--largo` | |
| Lousa | `.lousa` (+ `.lousa--rabiscada` para fórmulas de giz nos cantos) | Use `--rabiscada` só em blocos largos com texto centralizado |
| Arco do hero | `.hero-figura` + `.hero-quadro` | Professor saindo do arco verde com parábola em giz |
| Adesivos | `.adesivo--pi`, `--raiz`, `--soma` | Símbolos colados em volta do arco |
| Soma de credenciais | `.credibilidade` + `.credibilidade-operador` | "A + B + C" |
| Folha de caderno | `.sobre-texto` | Margem vermelha e furos de fichário |
| Polaroide | `.sobre-foto`, `.aluno-cartao` | Fita adesiva; alunos alternam a inclinação |
| Preço | `.preco` | Borda dupla — a "resposta final" enquadrada |
| Cartão-resposta | `.instituicao-chip` | Bolinha de gabarito preenchida |
| Correção | `.publico-cartao--sim` / `--nao` | Certinho verde / xis de caneta vermelha |
| Fichas de conteúdo | `.conteudo-bloco--aulas`, `--material`, `--reta-final`, `--suporte` | Cada frente com a cor do ícone |
| Reta numérica | `.banner-zero-reta` | O zero circulado — "começar do zero" |
| FAQ | `.duvida` | Numerada como lista de exercícios (contador CSS) |

## Fundo

- **Papel milimetrado** no `body` (rola com a página). Painéis usam
  **papel pontilhado**.
- **Fórmulas à mão** em três planos fixos (`.camada--longe/meio/perto`),
  geradas por `ferramentas/gerar_desenhos.py`.
- **Símbolos flutuando** (`.fundo-simbolos`) em Zen Kurenaido.
- **Textura de papel** (`.fundo-grao`) por cima de tudo, em `multiply`.

## Não faça

- Sombra com desfoque em cartão ou botão (quebra a linguagem do logo).
- Gradiente colorido, brilho neon, vidro fosco (`backdrop-filter`).
- Mais de uma palavra com marca-texto no mesmo título.
- Verde da marca como fundo de botão dentro da lousa.
- Emoji como ícone. Os ícones são SVG de traço, `stroke-width` 2.
- Inclinar (`rotate`) textos longos ou botões — a inclinação é só de
  etiquetas, adesivos, fitas e polaroides.
