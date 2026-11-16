/**
 * Scripts globais da plataforma Conexão água
 */
document.addEventListener("DOMContentLoaded", () => {
  atualizarAnoRodape();
  configurarBotaoTopo();
});

function atualizarAnoRodape() {
  try {
    const elementosAno = document.querySelectorAll("[data-current-year]");
    const anoAtual = new Date().getFullYear();
    elementosAno.forEach((el) => {
      el.textContent = anoAtual;
    });
  } catch (erro) {
    console.error("Erro ao atualizar ano no rodapé:", erro);
  }
}

function configurarBotaoTopo() {
  try {
    const botaoTopo = document.getElementById("scroll-top");
    if (!botaoTopo) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 250) {
        botaoTopo.classList.add("visivel");
      } else {
        botaoTopo.classList.remove("visivel");
      }
    });

    botaoTopo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  } catch (erro) {
    console.error("Erro ao configurar botão de rolagem:", erro);
  }
}