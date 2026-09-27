#!/usr/bin/env python3
"""
Gera os desenhos matematicos do fundo (parabola, Bhaskara, Pitagoras,
trigonometria, somatorio...) como SVG embutido em data: URI e grava o
resultado dentro do bloco marcado no CSS:

    /* <desenhos> ... */
    ...
    /* </desenhos> */

Por que um gerador?
  As formulas usam a fonte manuscrita Zen Kurenaido. SVG usado como
  background-image NAO enxerga as fontes da pagina, entao o texto de
  cada formula e convertido em contorno (path) aqui, uma vez so. O CSS
  final fica sem dependencia de fonte e cada plano do fundo continua
  sendo UM elemento composto (animacao so no compositor).

Uso (na raiz do projeto):
    pip install fonttools brotli
    python ferramentas/gerar_desenhos.py

So e preciso rodar de novo se voce mudar algum desenho ou cor aqui.
"""

from pathlib import Path
from urllib.parse import quote

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ / "src/fonts/zen-kurenaido-matematica.woff2"
ALVOS = [RAIZ / "src/css/estilo.css", RAIZ / "linknabio/src/css/estilo.css"]

# Tinta dos desenhos. Verde da marca no papel, giz nas lousas.
TINTA = "#0B7A36"
GIZ = "#F6F4EC"

fonte = TTFont(FONTE)
glifos = fonte.getGlyphSet()
mapa = fonte.getBestCmap()
UPM = fonte["head"].unitsPerEm


# ---------------------------------------------------------------
# Texto -> contorno
# ---------------------------------------------------------------
def texto(conteudo, x, y, tamanho, cor, espaco=0.0):
    """Devolve um <path> com o texto desenhado a partir de (x, y) na
    linha de base, e a largura ocupada.

    Trechos entre _{...} viram subscrito e ^{...} sobrescrito."""
    caneta = SVGPathPen(glifos)
    cursor = x
    i = 0
    while i < len(conteudo):
        escala_local, deslocamento = 1.0, 0.0
        if conteudo.startswith("_{", i) or conteudo.startswith("^{", i):
            fim = conteudo.index("}", i)
            trecho = conteudo[i + 2 : fim]
            if conteudo[i] == "_":
                escala_local, deslocamento = 0.62, tamanho * 0.22
            else:
                escala_local, deslocamento = 0.62, -tamanho * 0.42
            i = fim + 1
        else:
            trecho = conteudo[i]
            i += 1
        for caractere in trecho:
            nome = mapa.get(ord(caractere))
            if nome is None:
                raise SystemExit(f"Glifo ausente na fonte: {caractere!r}")
            s = tamanho * escala_local / UPM
            glifo = glifos[nome]
            # y do SVG cresce para baixo, o da fonte para cima: inverte.
            pen = TransformPen(caneta, (s, 0, 0, -s, cursor, y + deslocamento))
            glifo.draw(pen)
            cursor += glifo.width * s + espaco
    d = caneta.getCommands()
    return f"<path d='{d}' fill='{cor}' stroke='{cor}' stroke-width='0.5'/>", cursor - x


def svg(largura, altura, corpo, cor):
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {largura} {altura}' "
        f"fill='none' stroke='{cor}' stroke-width='1.6' stroke-linecap='round' "
        f"stroke-linejoin='round'>{corpo}</svg>"
    )


# ---------------------------------------------------------------
# Os desenhos (tracos levemente tortos de proposito: mao, nao regua)
# ---------------------------------------------------------------
def parabola(cor):
    rotulo_x, _ = texto("x", 186, 160, 15, cor)
    rotulo_y, _ = texto("y", 108, 18, 15, cor)
    corpo = (
        "<path d='M10 140Q100 141.5 190 139'/>"               # eixo x
        "<path d='M100 158Q99 90 101 14'/>"                   # eixo y
        "<path d='M183 134l7 5-7 5M95 21l6-7 5 7'/>"          # setas
        "<path d='M38 22Q101 262 162 26' stroke-width='2.4'/>"  # a parabola
        "<path d='M70 136v7M130 135v7M96 60h8M96 100h8'/>"    # marcas
        f"<circle cx='100' cy='140' r='3' fill='{cor}' stroke='none'/>"
        f"{rotulo_x}{rotulo_y}"
    )
    return svg(200, 170, corpo, cor)


def circulo(cor):
    rotulo, _ = texto("r", 80, 54, 16, cor)
    corpo = (
        "<path d='M60 13C87 12 108 34 107 61C106 88 85 108 59 107C33 106 13 86 14 59C15 33 34 14 62 14'/>"
        "<path d='M60 60Q83 59 106 60'/>"
        f"<circle cx='60' cy='60' r='2.6' fill='{cor}' stroke='none'/>"
        f"{rotulo}"
    )
    return svg(120, 120, corpo, cor)


def bhaskara(cor):
    x_igual, w = texto("x =", 4, 49, 22, cor)
    menos_b, w2 = texto("−b ±", 52, 34, 20, cor)
    radicando, w3 = texto("b^{2} − 4ac", 52 + w2 + 22, 34, 20, cor)
    inicio_raiz = 52 + w2 + 6
    fim_raiz = 52 + w2 + 22 + w3 + 4
    raiz = (
        f"<path d='M{inicio_raiz} 25l4 -2 5 14 7 -26 H{fim_raiz}' stroke-width='1.5'/>"
    )
    barra = f"<path d='M48 44Q{(48 + fim_raiz) / 2} 45.5 {fim_raiz + 4} 43.5' stroke-width='1.7'/>"
    dois_a, _ = texto("2a", (48 + fim_raiz) / 2 - 12, 70, 20, cor)
    largura = int(fim_raiz + 10)
    return svg(largura, 80, x_igual + menos_b + raiz + radicando + barra + dois_a, cor)


def pitagoras(cor):
    formula, _ = texto("a^{2} + b^{2} = c^{2}", 128, 90, 21, cor)
    corpo = (
        "<path d='M18 112Q65 113 112 111Q111 75 112 38Q66 76 18 112Z' stroke-width='1.7'/>"
        "<path d='M98 111V97.5h13.5'/>"
        f"{formula}"
    )
    return svg(250, 130, corpo, cor)


def trigonometria(cor):
    formula, w = texto("sen^{2}θ + cos^{2}θ = 1", 2, 29, 21, cor)
    return svg(int(w + 8), 40, formula, cor)


def angulo(cor):
    rotulo, _ = texto("θ", 50, 66, 17, cor)
    corpo = (
        "<path d='M12 74Q55 75 98 73'/>"
        "<path d='M12 74Q49 46 86 16'/>"
        "<path d='M46 74C46 66 43 60 38 55'/>"
        f"{rotulo}"
    )
    return svg(110, 90, corpo, cor)


def somatorio(cor):
    sigma, w = texto("Σ", 2, 38, 28, cor)
    resto, w2 = texto("(a_{1} + a_{n}) n / 2", 2 + w + 6, 35, 19, cor)
    return svg(int(2 + w + 6 + w2 + 6), 50, sigma + resto, cor)


DESENHOS = {
    "parabola": parabola,
    "circulo": circulo,
    "bhaskara": bhaskara,
    "pitagoras": pitagoras,
    "trigonometria": trigonometria,
    "angulo": angulo,
    "somatorio": somatorio,
}

# Quais desenhos ganham versao em giz (usados dentro das lousas)
EM_GIZ = ["bhaskara", "pitagoras", "trigonometria", "somatorio", "parabola"]


def data_uri(conteudo):
    return "url(\"data:image/svg+xml," + quote(conteudo, safe=" =:/'.,-()") + "\")"


def gerar_bloco():
    linhas = [
        "/* <desenhos> — gerado por ferramentas/gerar_desenhos.py. Nao edite a mao. */",
        ":root {",
    ]
    for nome, funcao in DESENHOS.items():
        linhas.append(f"  --desenho-{nome}: {data_uri(funcao(TINTA))};")
    for nome in EM_GIZ:
        linhas.append(f"  --desenho-{nome}-giz: {data_uri(DESENHOS[nome](GIZ))};")
    linhas.append("}")
    linhas.append("/* </desenhos> */")
    return "\n".join(linhas)


def main():
    bloco = gerar_bloco()
    for alvo in ALVOS:
        if not alvo.exists():
            print(f"(pulado) {alvo.relative_to(RAIZ)} nao existe")
            continue
        css = alvo.read_text(encoding="utf-8")
        inicio = css.find("/* <desenhos>")
        fim = css.find("/* </desenhos> */")
        if inicio == -1 or fim == -1:
            raise SystemExit(f"Marcadores <desenhos> nao encontrados em {alvo}")
        fim += len("/* </desenhos> */")
        alvo.write_text(css[:inicio] + bloco + css[fim:], encoding="utf-8")
        print(f"ok  {alvo.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
