/* =========================================================
   Prof. Henry Jansen — MatemáticaMC
   Script único das três páginas.

   Cada função procura os seus elementos e simplesmente
   retorna se não encontrar nada, então o mesmo arquivo serve
   para a landing e para as páginas de curso sem dar erro.
   ========================================================= */

(function () {
  "use strict";

  const preferemMenosMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     1. MENU MOBILE
     --------------------------------------------------------- */
  function ativarMenuMobile() {
    const botao = document.getElementById("nav-abrir");
    const links = document.getElementById("nav-links");
    if (!botao || !links) return;

    function fechar() {
      botao.setAttribute("aria-expanded", "false");
      links.classList.remove("aberto");
    }

    botao.addEventListener("click", () => {
      const aberto = botao.getAttribute("aria-expanded") === "true";
      botao.setAttribute("aria-expanded", String(!aberto));
      links.classList.toggle("aberto", !aberto);
    });

    /* Ao clicar num link do menu, fecha o painel. */
    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", fechar);
    });

    /* Fecha com Esc e ao voltar para a largura de desktop. */
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") fechar();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) fechar();
    });
  }

  /* ---------------------------------------------------------
     2. ENTRADA EM CASCATA
     Em páginas longas não faz sentido animar tudo no load:
     os elementos aparecem conforme entram na tela, em grupos,
     para o efeito de cascata acontecer onde a pessoa está
     olhando.
     --------------------------------------------------------- */
  function ativarCascata() {
    const elementos = document.querySelectorAll(".anim-cascata");
    if (!elementos.length) return;

    if (preferemMenosMovimento || !("IntersectionObserver" in window)) {
      elementos.forEach((elemento) => elemento.classList.add("visivel"));
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        /* Só as que acabaram de entrar recebem atraso crescente,
           para a cascata ficar curta e não parecer travamento. */
        const visiveis = entradas.filter((entrada) => entrada.isIntersecting);

        visiveis.forEach((entrada, indice) => {
          const elemento = entrada.target;
          elemento.style.setProperty("--atraso", `${indice * 70}ms`);
          elemento.classList.add("visivel");
          observador.unobserve(elemento);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elementos.forEach((elemento) => observador.observe(elemento));
  }

  /* ---------------------------------------------------------
     3. ONDA DE CLIQUE
     Círculo que se expande a partir do ponto clicado.
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
    document.querySelectorAll(".botao").forEach((botao) => {
      botao.addEventListener("click", (evento) => criarOnda(evento, botao));
    });
  }

  /* ---------------------------------------------------------
     4. CARROSSEL — ALUNOS APROVADOS
     Rolagem horizontal nativa (scroll-snap) com setas e
     pontos sincronizados.
     --------------------------------------------------------- */
  function ativarCarrossel() {
    const trilha = document.getElementById("carrossel-alunos");
    const pontosContainer = document.getElementById("carrossel-pontos");
    const setaAnterior = document.querySelector(".carrossel-seta--anterior");
    const setaProxima = document.querySelector(".carrossel-seta--proxima");
    if (!trilha) return;

    const cartoes = Array.from(trilha.children);
    if (!cartoes.length) return;

    /* offsetWidth e a largura de layout: nao muda com a leve rotacao
       dos cartoes (polaroides tortas). O getBoundingClientRect mediria
       a caixa girada, alguns pixels maior, e o erro se acumularia a
       cada pagina do carrossel. */
    function passo() {
      const cartao = cartoes[0].offsetWidth;
      const espaco = parseFloat(getComputedStyle(trilha).gap) || 16;
      return cartao + espaco;
    }

    function porTela() {
      return Math.max(1, Math.round(trilha.clientWidth / passo()));
    }

    function totalPaginas() {
      return Math.max(1, Math.ceil(cartoes.length / porTela()));
    }

    function paginaAtual() {
      return Math.round(trilha.scrollLeft / (passo() * porTela()));
    }

    /* A pagina de destino fica guardada aqui em vez de ser lida do
       scrollLeft a cada clique. Durante a rolagem suave o scrollLeft
       ainda esta no meio do caminho, entao dois cliques rapidos na
       seta calculavam a mesma pagina e o segundo nao andava. */
    let paginaAlvo = 0;

    function irParaPagina(indice) {
      paginaAlvo = Math.max(0, Math.min(totalPaginas() - 1, indice));
      trilha.scrollTo({
        left: paginaAlvo * passo() * porTela(),
        behavior: preferemMenosMovimento ? "auto" : "smooth",
      });
    }

    function construirPontos() {
      if (!pontosContainer) return;
      pontosContainer.innerHTML = "";

      const paginas = totalPaginas();
      /* Com uma página só, os pontos não comunicam nada. */
      if (paginas < 2) return;

      /* No celular cabe um cartão por vez, entao 13 alunos viram 13
         pontos — uma fileira que nao comunica nada e quase estoura a
         largura. Acima de oito paginas, um contador informa melhor. */
      if (paginas > 8) {
        const contador = document.createElement("p");
        contador.className = "carrossel-contador";
        contador.setAttribute("role", "status");
        contador.setAttribute("aria-live", "polite");
        pontosContainer.appendChild(contador);
        return;
      }

      for (let i = 0; i < paginas; i++) {
        const ponto = document.createElement("button");
        ponto.type = "button";
        ponto.className = "carrossel-ponto";
        ponto.setAttribute("aria-label", `Ir para o grupo ${i + 1}`);
        ponto.addEventListener("click", () => irParaPagina(i));
        pontosContainer.appendChild(ponto);
      }
    }

    function atualizarControles() {
      const atual = paginaAtual();

      if (pontosContainer) {
        const contador = pontosContainer.querySelector(".carrossel-contador");

        if (contador) {
          contador.textContent = `${atual + 1} / ${totalPaginas()}`;
        } else {
          Array.from(pontosContainer.children).forEach((ponto, indice) => {
            ponto.classList.toggle("ativo", indice === atual);
          });
        }
      }

      /* Margem de 2px evita que o arredondamento deixe a seta
         travada no fim da rolagem. */
      const fim = trilha.scrollWidth - trilha.clientWidth - 2;
      if (setaAnterior) setaAnterior.disabled = trilha.scrollLeft <= 2;
      if (setaProxima) setaProxima.disabled = trilha.scrollLeft >= fim;
    }

    if (setaAnterior) {
      setaAnterior.addEventListener("click", () => irParaPagina(paginaAlvo - 1));
    }

    if (setaProxima) {
      setaProxima.addEventListener("click", () => irParaPagina(paginaAlvo + 1));
    }

    /* Quando a pessoa arrasta o carrossel com o dedo, o alvo precisa
       voltar a acompanhar onde ela parou — mas so depois que a rolagem
       assenta, senao a propria animacao suave sobrescreveria o alvo. */
    let tempoAssentar;
    trilha.addEventListener(
      "scroll",
      () => {
        atualizarControles();
        clearTimeout(tempoAssentar);
        tempoAssentar = setTimeout(() => {
          paginaAlvo = paginaAtual();
        }, 120);
      },
      { passive: true }
    );

    let tempoRedimensionar;
    window.addEventListener("resize", () => {
      clearTimeout(tempoRedimensionar);
      tempoRedimensionar = setTimeout(() => {
        construirPontos();
        atualizarControles();
      }, 150);
    });

    construirPontos();
    atualizarControles();
  }

  /* ---------------------------------------------------------
     5. FAQ — ACORDEÃO
     --------------------------------------------------------- */
  function ativarDuvidas() {
    const perguntas = document.querySelectorAll(".duvida-pergunta");
    if (!perguntas.length) return;

    perguntas.forEach((pergunta) => {
      pergunta.addEventListener("click", () => {
        const duvida = pergunta.closest(".duvida");
        const aberta = duvida.classList.contains("aberta");

        /* Uma resposta aberta por vez mantém a seção curta. */
        document.querySelectorAll(".duvida.aberta").forEach((outra) => {
          outra.classList.remove("aberta");
          const botao = outra.querySelector(".duvida-pergunta");
          if (botao) botao.setAttribute("aria-expanded", "false");
        });

        if (!aberta) {
          duvida.classList.add("aberta");
          pergunta.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------------------------------------------------------
     6. ANO DO RODAPÉ
     --------------------------------------------------------- */
  function preencherAno() {
    document.querySelectorAll("[data-ano]").forEach((elemento) => {
      elemento.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------------------------------------------------------
     7. INICIALIZAÇÃO
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    ativarMenuMobile();
    ativarCascata();
    ativarOndaDeClique();
    ativarCarrossel();
    ativarDuvidas();
    preencherAno();
  });
})();
