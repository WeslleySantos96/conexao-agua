/**
 * Módulo de Ocorrências Hídricas - Água para Todos (ODS 6)
 * Operações CRUD no DOM: Adicionar, Listar, Editar e Remover.
 */

let ocorrencias = [
  {
    id: 1,
    morador: "Weslley Santos",
    bairro: "Vila das Águas",
    tipo: "Falta de abastecimento de água",
    gravidade: "Alta",
    descricao: "Rua das águas sem fornecimento de água há mais de 36 horas."
  }
];

let proximoId = 2;

document.addEventListener("DOMContentLoaded", () => {
  inicializarModuloOcorrencias();
});

function inicializarModuloOcorrencias() {
  try {
    const form = document.getElementById("form-ocorrencia");
    const btnCancelar = document.getElementById("btn-cancelar-edicao");
    const btnLimparLogs = document.getElementById("btn-limpar-logs");

    if (!form) return;

    form.addEventListener("submit", aoSubmeterFormulario);
    btnCancelar.addEventListener("click", cancelarEdicao);
    btnLimparLogs.addEventListener("click", limparPainelLogs);

    renderizarOcorrencias();
    registrarAtividade("Sistema", "Painel comunitário ODS 6 iniciado com 1 ocorrência registrada.");
  } catch (erro) {
    console.error("Falha ao iniciar módulo de ocorrências:", erro);
  }
}

function validarFormulario() {
  let valido = true;
  limparErrosVisuais();

  const morador = document.getElementById("morador");
  const bairro = document.getElementById("bairro");
  const tipo = document.getElementById("tipo");
  const descricao = document.getElementById("descricao");

  if (!morador.value.trim() || morador.value.trim().length < 3) {
    exibirErroCampo(morador, "erro-morador", "Informe o nome do solicitante (mínimo 3 caracteres).");
    valido = false;
  }

  if (!bairro.value.trim() || bairro.value.trim().length < 3) {
    exibirErroCampo(bairro, "erro-bairro", "Informe o bairro ou comunidade (mínimo 3 caracteres).");
    valido = false;
  }

  if (!tipo.value) {
    exibirErroCampo(tipo, "erro-tipo", "Selecione o tipo de ocorrência.");
    valido = false;
  }

  if (!descricao.value.trim() || descricao.value.trim().length < 10) {
    exibirErroCampo(descricao, "erro-descricao", "Descreva a ocorrência com pelo menos 10 caracteres.");
    valido = false;
  }

  return valido;
}

function exibirErroCampo(input, idMensagem, mensagem) {
  input.classList.add("campo-invalido");
  const spanErro = document.getElementById(idMensagem);
  if (spanErro) spanErro.textContent = mensagem;
}

function limparErrosVisuais() {
  document.querySelectorAll(".campo-invalido").forEach((el) => el.classList.remove("campo-invalido"));
  document.querySelectorAll(".erro-campo").forEach((el) => (el.textContent = ""));
}

function aoSubmeterFormulario(evento) {
  evento.preventDefault();

  try {
    if (!validarFormulario()) {
      registrarAtividade("Validação", "Envio bloqueado: corrija os campos destacados no formulário.", true);
      return;
    }

    const idEdicao = document.getElementById("ocorrencia-id").value;
    const dados = {
      morador: document.getElementById("morador").value.trim(),
      bairro: document.getElementById("bairro").value.trim(),
      tipo: document.getElementById("tipo").value,
      gravidade: document.getElementById("gravidade").value,
      descricao: document.getElementById("descricao").value.trim()
    };

    if (idEdicao) {
      atualizarOcorrencia(Number(idEdicao), dados);
    } else {
      adicionarOcorrencia(dados);
    }

    resetarFormulario();
    renderizarOcorrencias();
  } catch (erro) {
    registrarAtividade("Erro", `Falha ao salvar ocorrência: ${erro.message}`, true);
  }
}

function adicionarOcorrencia(dados) {
  const novaOcorrencia = { id: proximoId++, ...dados };
  ocorrencias.push(novaOcorrencia);
  registrarAtividade("Adição", `Ocorrência #${novaOcorrencia.id} (${novaOcorrencia.bairro}) adicionada com sucesso.`);
}

function atualizarOcorrencia(id, dadosAtualizados) {
  const indice = ocorrencias.findIndex((item) => item.id === id);
  if (indice === -1) throw new Error("Ocorrência não encontrada para edição.");

  ocorrencias[indice] = { id, ...dadosAtualizados };
  registrarAtividade("Edição", `Ocorrência #${id} (${dadosAtualizados.bairro}) atualizada com sucesso.`);
}

function prepararEdicao(id) {
  try {
    const item = ocorrencias.find((o) => o.id === id);
    if (!item) throw new Error("Registro não encontrado.");

    document.getElementById("ocorrencia-id").value = item.id;
    document.getElementById("morador").value = item.morador;
    document.getElementById("bairro").value = item.bairro;
    document.getElementById("tipo").value = item.tipo;
    document.getElementById("gravidade").value = item.gravidade;
    document.getElementById("descricao").value = item.descricao;

    document.getElementById("titulo-formulario").textContent = `Editando Ocorrência #${item.id}`;
    document.getElementById("btn-salvar").innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
    document.getElementById("btn-cancelar-edicao").classList.remove("d-none");

    limparErrosVisuais();
    registrarAtividade("Consulta", `Ocorrência #${id} carregada no formulário para edição.`);
  } catch (erro) {
    registrarAtividade("Erro", `Erro ao carregar edição: ${erro.message}`, true);
  }
}

function removerOcorrencia(id) {
  try {
    const item = ocorrencias.find((o) => o.id === id);
    if (!item) throw new Error("Registro não encontrado para remoção.");

    ocorrencias = ocorrencias.filter((o) => o.id !== id);
    renderizarOcorrencias();

    if (Number(document.getElementById("ocorrencia-id").value) === id) {
      resetarFormulario();
    }

    registrarAtividade("Remoção", `Ocorrência #${id} (${item.bairro}) removida com sucesso.`);
  } catch (erro) {
    registrarAtividade("Erro", `Erro ao remover ocorrência: ${erro.message}`, true);
  }
}

function renderizarOcorrencias() {
  try {
    const container = document.getElementById("lista-ocorrencias");
    const contador = document.getElementById("contador-itens");
    if (!container) return;

    contador.textContent = `${ocorrencias.length} ${ocorrencias.length === 1 ? "item" : "itens"}`;

    if (ocorrencias.length === 0) {
      container.innerHTML = '<p class="texto-suave mb-0">Nenhuma ocorrência registrada no momento. Utilize o formulário ao lado para relatar um problema.</p>';
      return;
    }

    container.innerHTML = "";

    ocorrencias.forEach((item) => {
      const classeUrgencia =
        item.gravidade === "Alta"
          ? "urgencia-alta"
          : item.gravidade === "Média"
          ? "urgencia-media"
          : "";

      const card = document.createElement("article");
      card.className = `item-ocorrencia ${classeUrgencia}`;

      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <strong>#${item.id} — ${escaparHTML(item.tipo)}</strong>
            <div class="texto-suave">Bairro: ${escaparHTML(item.bairro)} | Relatado por: ${escaparHTML(item.morador)}</div>
          </div>
          <span class="badge bg-dark">Urgência: ${escaparHTML(item.gravidade)}</span>
        </div>
        <p class="mt-2 mb-3">${escaparHTML(item.descricao)}</p>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-outline-primary btn-editar">
            <i class="fas fa-pen"></i> Editar
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger btn-remover">
            <i class="fas fa-trash"></i> Remover
          </button>
        </div>
      `;

      card.querySelector(".btn-editar").addEventListener("click", () => prepararEdicao(item.id));
      card.querySelector(".btn-remover").addEventListener("click", () => removerOcorrencia(item.id));

      container.appendChild(card);
    });
  } catch (erro) {
    registrarAtividade("Erro", `Falha ao listar ocorrências: ${erro.message}`, true);
  }
}

function cancelarEdicao() {
  resetarFormulario();
  registrarAtividade("Edição", "Edição cancelada pelo usuário.");
}

function resetarFormulario() {
  const form = document.getElementById("form-ocorrencia");
  form.reset();
  document.getElementById("ocorrencia-id").value = "";
  document.getElementById("titulo-formulario").textContent = "Registrar Nova Ocorrência";
  document.getElementById("btn-salvar").innerHTML = '<i class="fas fa-plus-circle"></i> Adicionar Ocorrência';
  document.getElementById("btn-cancelar-edicao").classList.add("d-none");
  limparErrosVisuais();
}

function registrarAtividade(acao, resultado, isErro = false) {
  const listaLogs = document.getElementById("lista-logs");
  if (!listaLogs) return;

  const agora = new Date();
  const dataHora =
    agora.toLocaleDateString("pt-BR") +
    " " +
    agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const li = document.createElement("li");
  if (isErro) li.classList.add("log-erro");
  li.textContent = `${dataHora} — ${acao}: ${resultado}`;

  listaLogs.prepend(li);
}

function limparPainelLogs() {
  const listaLogs = document.getElementById("lista-logs");
  if (listaLogs) {
    listaLogs.innerHTML = "";
    registrarAtividade("Sistema", "Histórico de atividades limpo.");
  }
}

function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}