/* =========================================================
   Prof. Henry Jansen — MatemáticaMC
   Link na bio.

   A pagina inteira cabe numa tela, entao a entrada em cascata
   acontece no carregamento — nao faz sentido esperar rolagem
   como no site principal.
   ========================================================= */

(function () {
  "use strict";

  const preferemMenosMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     1. ENTRADA EM CASCATA
     Cada elemento marcado com .anim-cascata recebe um atraso
     crescente, criando o efeito de aparecer um apos o outro.
     --------------------------------------------------------- */
  function aplicarCascata() {
    const elementos = document.querySelectorAll(".anim-cascata");
    if (!elementos.length) return;

    elementos.forEach((elemento, indice) => {
      if (preferemMenosMovimento) {
        elemento.classList.add("visivel");
        return;
      }
      elemento.style.setProperty("--atraso", `${indice * 70}ms`);
    });

    if (preferemMenosMovimento) return;

    /* Um quadro de folga antes de revelar: garante que o
       navegador aplicou o estado inicial e a transicao roda de
       verdade, em vez de aparecer tudo de uma vez. */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        elementos.forEach((elemento) => elemento.classList.add("visivel"));
      });
    });
  }

  /* ---------------------------------------------------------
     2. ONDA DE CLIQUE
     Circulo que se expande a partir do ponto tocado.
     --------------------------------------------------------- */
  function criarOnda(evento, elemento) {
    if (preferemMenosMovimento) return;

    const retangulo = elemento.getBoundingClientRect();
    const tamanho = Math.max(retangulo.width, retangulo.height);

    const origemX = evento.clientX || retangulo.left + retangulo.width / 2;
    const origemY = evento.clientY || retangulo.top + retangulo.height / 2;

    const onda = document.createElement("span");
    onda.className = "onda";
    onda.style.width = `${tamanho}px`;
    onda.style.height = `${tamanho}px`;
    onda.style.left = `${origemX - retangulo.left - tamanho / 2}px`;
    onda.style.top = `${origemY - retangulo.top - tamanho / 2}px`;

    elemento.appendChild(onda);
    onda.addEventListener("animationend", () => onda.remove());
  }

  function ativarOndaDeClique() {
    document.querySelectorAll(".botao-link").forEach((botao) => {
      botao.addEventListener("click", (evento) => criarOnda(evento, botao));
    });
  }

  /* ---------------------------------------------------------
     3. ANO DO RODAPÉ
     --------------------------------------------------------- */
  function preencherAno() {
    document.querySelectorAll("[data-ano]").forEach((elemento) => {
      elemento.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------------------------------------------------------
     4. INICIALIZAÇÃO
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    aplicarCascata();
    ativarOndaDeClique();
    preencherAno();
  });
})();
