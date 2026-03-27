function buildApiBaseCandidates() {
  // Monta uma lista de URLs possíveis da API para facilitar quando mudar de ambiente
  // (localhost, 127.0.0.1, etc.) sem precisar alterar o código toda hora.
  const configured = window.localStorage.getItem("API_BASE_URL");
  const defaults = ["http://localhost:3000", "http://127.0.0.1:3000"];

  if (window.location.protocol !== "file:") {
    defaults.unshift(`${window.location.protocol}//${window.location.hostname}:3000`);
  }

  return [...new Set([configured, ...defaults].filter(Boolean))];
}

const API_BASE_CANDIDATES = buildApiBaseCandidates();
let activeApiBase = API_BASE_CANDIDATES[0];
// "activeResource" controla qual módulo está ativo na tela (dashboard, advogados, etc.).
let activeResource = "dashboard";
let lastRenderedRows = [];
let lastRenderedColumns = [];

const tableTitle = document.getElementById("tableTitle");
const statusText = document.getElementById("statusText");
const dashboardPanel = document.getElementById("dashboardPanel");
const filtersPanel = document.getElementById("filtersPanel");
const resultsPanel = document.getElementById("resultsPanel");
const writePanel = document.getElementById("writePanel");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const tableFilter = document.getElementById("tableFilter");
const btnClearFilter = document.getElementById("btnClearFilter");
const dashAdvogados = document.getElementById("dashAdvogados");
const dashClientes = document.getElementById("dashClientes");
const dashEscritorios = document.getElementById("dashEscritorios");
const dashProcessos = document.getElementById("dashProcessos");
const dashboardChartCanvas = document.getElementById("dashboardChart");
const formAdvogadoNome = document.getElementById("formAdvogadoNome");
const formClienteNome = document.getElementById("formClienteNome");
const formEscritorioEmail = document.getElementById("formEscritorioEmail");
const formEscritorioTelefone = document.getElementById("formEscritorioTelefone");
const filterSectionAdvogados = document.getElementById("filterSectionAdvogados");
const filterSectionClientes = document.getElementById("filterSectionClientes");
const filterSectionEscritorios = document.getElementById("filterSectionEscritorios");
const filterSectionProcessos = document.getElementById("filterSectionProcessos");
const kpiRows = document.getElementById("kpiRows");
const kpiModulo = document.getElementById("kpiModulo");
const navButtons = [...document.querySelectorAll(".nav-item")];
const formWriteOperation = document.getElementById("formWriteOperation");
const writeResource = document.getElementById("writeResource");
const writeResourceLabel = document.getElementById("writeResourceLabel");
const writeMethod = document.getElementById("writeMethod");
const writeId = document.getElementById("writeId");
const simpleAdvogados = document.getElementById("simpleAdvogados");
const simpleClientes = document.getElementById("simpleClientes");
const simpleEscritorios = document.getElementById("simpleEscritorios");
const simpleProcessos = document.getElementById("simpleProcessos");
const advEscritorioId = document.getElementById("advEscritorioId");
const advNome = document.getElementById("advNome");
const advOab = document.getElementById("advOab");
const advEspecialidade = document.getElementById("advEspecialidade");
const advEmail = document.getElementById("advEmail");
const advTelefone = document.getElementById("advTelefone");
const advAtivo = document.getElementById("advAtivo");
const cliNome = document.getElementById("cliNome");
const cliDocumento = document.getElementById("cliDocumento");
const cliEmail = document.getElementById("cliEmail");
const cliTelefone = document.getElementById("cliTelefone");
const cliEndereco = document.getElementById("cliEndereco");
const cliCidade = document.getElementById("cliCidade");
const cliEstado = document.getElementById("cliEstado");
const cliCep = document.getElementById("cliCep");
const escNome = document.getElementById("escNome");
const escCnpj = document.getElementById("escCnpj");
const escEmail = document.getElementById("escEmail");
const escTelefone = document.getElementById("escTelefone");
const escEndereco = document.getElementById("escEndereco");
const escCidade = document.getElementById("escCidade");
const escEstado = document.getElementById("escEstado");
const escCep = document.getElementById("escCep");
const proEscritorioId = document.getElementById("proEscritorioId");
const proAdvogadoId = document.getElementById("proAdvogadoId");
const proClienteId = document.getElementById("proClienteId");
const proNumero = document.getElementById("proNumero");
const proTitulo = document.getElementById("proTitulo");
const proStatus = document.getElementById("proStatus");
const proDescricao = document.getElementById("proDescricao");
const deleteConfirmModalEl = document.getElementById("deleteConfirmModal");
const deleteConfirmText = document.getElementById("deleteConfirmText");
const btnConfirmDelete = document.getElementById("btnConfirmDelete");

const deleteConfirmModal =
  deleteConfirmModalEl && window.bootstrap
    ? new window.bootstrap.Modal(deleteConfirmModalEl)
    : null;
// Resolver da Promise usada para esperar a resposta do usuário no modal de exclusão.
let deleteConfirmResolver = null;
let dashboardChart = null;

const createRouteByResource = {
  advogados: "/criar-advogado",
  clientes: "/criar-cliente",
  escritorios: "/criar-escritorio",
  processos: "/criar-processo",
};

const listRouteByResource = {
  advogados: "/advogados",
  clientes: "/clientes",
  escritorios: "/escritorios",
  processos: "/processos",
};

const navButtonByResource = {
  advogados: "btnAdvogados",
  clientes: "btnClientes",
  escritorios: "btnEscritorios",
  processos: "btnProcessos",
};

const resourceByNavButton = {
  btnDashboard: "dashboard",
  btnAdvogados: "advogados",
  btnClientes: "clientes",
  btnEscritorios: "escritorios",
  btnProcessos: "processos",
};

const filterFormsByResource = {
  advogados: [formAdvogadoNome],
  clientes: [formClienteNome],
  escritorios: [formEscritorioEmail, formEscritorioTelefone],
  processos: [],
};

const allContextualFilterForms = Object.values(filterFormsByResource).flat();
const filterSectionsByResource = {
  advogados: filterSectionAdvogados,
  clientes: filterSectionClientes,
  escritorios: filterSectionEscritorios,
  processos: filterSectionProcessos,
};
const resourceLabelByKey = {
  dashboard: "Dashboard",
  advogados: "Advogados",
  clientes: "Clientes",
  escritorios: "Escritorios",
  processos: "Processos",
};

const actionToHttpMethod = {
  criar: "POST",
  atualizar: "PUT",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  post: "POST",
  put: "PUT",
  delete: "DELETE",
};

const actionLabelByHttpMethod = {
  POST: "Criar",
  PUT: "Atualizar",
  DELETE: "Apagar",
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setStatus(message, tone = "neutral") {
  // Atualiza a "mensagem de status" no topo e aplica a cor do alerta Bootstrap.
  statusText.textContent = message;
  statusText.classList.remove(
    "status-danger",
    "status-success",
    "alert-danger",
    "alert-success",
    "alert-secondary"
  );

  if (tone === "danger") {
    statusText.classList.add("status-danger", "alert-danger");
    return;
  }

  if (tone === "success") {
    statusText.classList.add("status-success", "alert-success");
    return;
  }

  statusText.classList.add("alert-secondary");
}

function normalizeRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") return [payload];
  return [];
}

function applyClientFilter(rows, query) {
  const term = query.trim().toLowerCase();
  if (!term) return rows;

  return rows.filter((row) =>
    Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(term))
  );
}

function paintTable(columns, rows) {
  // Só mostramos a coluna "ações" (com botão Excluir) em módulos de entidade.
  const showDeleteAction = ["advogados", "clientes", "escritorios", "processos"].includes(
    activeResource
  );

  const headColumns = showDeleteAction ? [...columns, "acoes"] : columns;

  if (rows.length === 0) {
    tableHead.innerHTML = headColumns.length
      ? `<tr>${headColumns.map((col) => `<th>${escapeHtml(col)}</th>`).join("")}</tr>`
      : "";

    const span = Math.max(headColumns.length, 1);
    tableBody.innerHTML = `<tr><td class="empty-row" colspan="${span}">Nenhum registro encontrado.</td></tr>`;
    return;
  }

  tableHead.innerHTML = `<tr>${headColumns.map((col) => `<th>${escapeHtml(col)}</th>`).join("")}</tr>`;
  tableBody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        ${columns
          .map((col) => {
            const value = row[col];
            return `<td>${escapeHtml(value == null ? "-" : value)}</td>`;
          })
          .join("")}
        ${
          showDeleteAction
            ? `<td>${
                row.id == null
                  ? "-"
                  : `<button class="btn btn-danger btn-row-delete" type="button" data-resource="${escapeHtml(
                      activeResource
                    )}" data-id="${escapeHtml(String(row.id))}">Excluir</button>`
              }</td>`
            : ""
        }
      </tr>
    `
    )
    .join("");
}

function refreshFilteredTable() {
  const filtered = applyClientFilter(lastRenderedRows, tableFilter.value);
  paintTable(lastRenderedColumns, filtered);
  kpiRows.textContent = String(filtered.length);
}

function renderTable(title, payload) {
  // "payload" pode vir como objeto único ou array; aqui normalizamos para array.
  const rows = normalizeRows(payload);
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];

  tableTitle.textContent = title;

  lastRenderedRows = rows;
  lastRenderedColumns = columns;
  refreshFilteredTable();
}

function activateNav(buttonId) {
  // Marca visualmente o botão ativo na sidebar.
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.id === buttonId);
  });

  const activeName = document.getElementById(buttonId)?.textContent?.trim() || "-";
  kpiModulo.textContent = activeName;

  const resource = resourceByNavButton[buttonId];
  if (resource) {
    activeResource = resource;
    // Dashboard mostra painel de métricas; entidades mostram filtros + formulário.
    const isDashboard = resource === "dashboard";
    dashboardPanel.hidden = !isDashboard;
    filtersPanel.hidden = isDashboard;
    writePanel.hidden = isDashboard;
    resultsPanel.hidden = false;

    if (isDashboard) {
      kpiModulo.textContent = "Dashboard";
      return;
    }

    toggleFilterForms(resource);
    writeResource.value = resource;
    writeResourceLabel.textContent = resourceLabelByKey[resource] || resource;
    toggleSimpleForms();
  }
}

function toNumberOrNull(value) {
  const text = String(value ?? "").trim();
  return text ? Number(text) : null;
}

function toggleSimpleForms() {
  // Exibe apenas o formulário da entidade ativa e desabilita os demais campos.
  const resource = writeResource.value;
  const formBoxes = {
    advogados: simpleAdvogados,
    clientes: simpleClientes,
    escritorios: simpleEscritorios,
    processos: simpleProcessos,
  };

  Object.entries(formBoxes).forEach(([boxResource, boxElement]) => {
    if (!boxElement) return;
    const isActive = boxResource === resource;
    boxElement.hidden = !isActive;

    boxElement.querySelectorAll("input, select, textarea, button").forEach((field) => {
      field.disabled = !isActive;
    });
  });
}

function toggleFilterForms(resource) {
  // Mostra filtros específicos do módulo selecionado (ex.: nome para clientes).
  allContextualFilterForms.forEach((form) => {
    form.hidden = !(filterFormsByResource[resource] || []).includes(form);
  });

  Object.entries(filterSectionsByResource).forEach(([sectionResource, sectionElement]) => {
    if (!sectionElement) return;
    sectionElement.hidden = sectionResource !== resource;
  });
}

function buildAdvogadoPayloadFromSimpleForm() {
  const escritorioId = advEscritorioId.value.trim();
  const nome = advNome.value.trim();
  const oab = advOab.value.trim();
  const especialidade = advEspecialidade.value.trim();
  const email = advEmail.value.trim();
  const telefone = advTelefone.value.trim();
  const ativo = advAtivo.value;

  if (!escritorioId || !nome || !oab) return null;

  return {
    escritorio_id: Number(escritorioId),
    nome,
    oab,
    especialidade: especialidade || null,
    email: email || null,
    telefone: telefone || null,
    ativo: Number(ativo),
  };
}

function buildClientePayloadFromSimpleForm() {
  const nome = cliNome.value.trim();
  if (!nome) return null;

  return {
    nome,
    documento: cliDocumento.value.trim() || null,
    email: cliEmail.value.trim() || null,
    telefone: cliTelefone.value.trim() || null,
    endereco: cliEndereco.value.trim() || null,
    cidade: cliCidade.value.trim() || null,
    estado: cliEstado.value.trim() || null,
    cep: cliCep.value.trim() || null,
  };
}

function buildEscritorioPayloadFromSimpleForm() {
  const nome = escNome.value.trim();
  const cnpj = escCnpj.value.trim();
  if (!nome || !cnpj) return null;

  return {
    nome,
    cnpj,
    email: escEmail.value.trim() || null,
    telefone: escTelefone.value.trim() || null,
    endereco: escEndereco.value.trim() || null,
    cidade: escCidade.value.trim() || null,
    estado: escEstado.value.trim() || null,
    cep: escCep.value.trim() || null,
  };
}

function buildProcessoPayloadFromSimpleForm(method) {
  const escritorio_id = toNumberOrNull(proEscritorioId.value);
  if (method === "PUT" && escritorio_id == null) return null;

  return {
    escritorio_id,
    advogado_id: toNumberOrNull(proAdvogadoId.value),
    cliente_id: toNumberOrNull(proClienteId.value),
    numero: proNumero.value.trim() || null,
    titulo: proTitulo.value.trim() || null,
    status: proStatus.value.trim() || null,
    descricao: proDescricao.value.trim() || null,
  };
}

function buildPayloadFromSimpleForm(resource, method) {
  if (resource === "advogados") return buildAdvogadoPayloadFromSimpleForm();
  if (resource === "clientes") return buildClientePayloadFromSimpleForm();
  if (resource === "escritorios") return buildEscritorioPayloadFromSimpleForm();
  if (resource === "processos") return buildProcessoPayloadFromSimpleForm(method);
  return null;
}

async function fetchWithFallback(endpoint, options = {}) {
  // Tenta cada URL candidata da API até encontrar uma que responda.
  let lastError = null;

  for (const base of API_BASE_CANDIDATES) {
    try {
      const response = await fetch(`${base}${endpoint}`, options);
      activeApiBase = base;
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw (
    lastError ||
    new Error(`Nao foi possivel conectar com a API (${API_BASE_CANDIDATES.join(", ")})`)
  );
}

async function parseResponseJson(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  return response.json();
}

async function fetchGet(endpoint, title, buttonId = "") {
  // Fluxo padrão para consultas GET e renderização da tabela.
  try {
    setStatus(`Consultando ${endpoint} em ${activeApiBase}...`);
    if (buttonId) activateNav(buttonId);

    const response = await fetchWithFallback(endpoint);
    const data = await response.json();

    if (!response.ok) {
      const message = data?.error || `Erro HTTP ${response.status}`;
      throw new Error(message);
    }

    renderTable(title, data);
    setStatus(`Consulta concluida: ${endpoint} (${activeApiBase})`, "success");
  } catch (error) {
    renderTable(title, []);

    const guidance =
      error.message === "Failed to fetch"
        ? "Falha de conexao com a API. Confirme se o backend esta rodando na porta 3000."
        : error.message;

    setStatus(`Falha: ${guidance}`, "danger");
  }
}

async function fetchCollection(resource) {
  // Helper para buscar coleção completa de uma entidade (usado no dashboard).
  const response = await fetchWithFallback(listRouteByResource[resource]);
  const data = await parseResponseJson(response);
  if (!response.ok) {
    const message = data?.error || `Erro HTTP ${response.status}`;
    throw new Error(message);
  }
  return Array.isArray(data) ? data : [];
}

async function loadDashboard() {
  // Carrega os 4 módulos em paralelo para montar os indicadores rapidamente.
  activateNav("btnDashboard");
  tableTitle.textContent = "Resumo Operacional";
  setStatus("Carregando indicadores operacionais...", "neutral");

  try {
    const [advogados, clientes, escritorios, processos] = await Promise.all([
      fetchCollection("advogados"),
      fetchCollection("clientes"),
      fetchCollection("escritorios"),
      fetchCollection("processos"),
    ]);

    dashAdvogados.textContent = String(advogados.length);
    dashClientes.textContent = String(clientes.length);
    dashEscritorios.textContent = String(escritorios.length);
    dashProcessos.textContent = String(processos.length);
    updateDashboardChart([
      advogados.length,
      clientes.length,
      escritorios.length,
      processos.length,
    ]);

    const dashboardRows = [
      { modulo: "Advogados", total: advogados.length },
      { modulo: "Clientes", total: clientes.length },
      { modulo: "Escritorios", total: escritorios.length },
      { modulo: "Processos", total: processos.length },
    ];

    renderTable("Resumo Operacional", dashboardRows);
    setStatus(`Dashboard atualizado (${activeApiBase}).`, "success");
  } catch (error) {
    dashAdvogados.textContent = "0";
    dashClientes.textContent = "0";
    dashEscritorios.textContent = "0";
    dashProcessos.textContent = "0";
    updateDashboardChart([0, 0, 0, 0]);
    renderTable("Resumo Operacional", []);
    setStatus(`Falha ao carregar dashboard: ${error.message}`, "danger");
  }
}

function updateDashboardChart(values) {
  // Atualiza (ou recria) o gráfico do dashboard com os totais atuais.
  if (!dashboardChartCanvas || !window.Chart) return;

  if (dashboardChart) {
    dashboardChart.destroy();
    dashboardChart = null;
  }

  dashboardChart = new window.Chart(dashboardChartCanvas, {
    type: "bar",
    data: {
      labels: ["Advogados", "Clientes", "Escritorios", "Processos"],
      datasets: [
        {
          label: "Total de Registros",
          data: values,
          backgroundColor: ["#0d6efd", "#2f80ed", "#111827", "#5b8def"],
          borderColor: "#0b1220",
          borderWidth: 1,
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            stepSize: 1,
          },
        },
      },
    },
  });
}

async function submitWriteOperation(event) {
  // Aqui tratamos "Criar" e "Atualizar" do formulário principal.
  // Exclusão foi propositalmente removida deste fluxo para evitar erros de UX.
  event.preventDefault();

  const resource = writeResource.value;
  const action = writeMethod.value;
  const method = actionToHttpMethod[action];
  const id = writeId.value.trim();

  if (!method) {
    setStatus("Acao invalida. Recarregue a pagina e tente novamente.", "danger");
    return;
  }

  if (method === "DELETE") {
    setStatus("Exclusao permitida apenas pelo botao Excluir na tabela.", "danger");
    return;
  }

  let endpoint = "";
  let payload = null;

  if (method === "POST") {
    endpoint = createRouteByResource[resource];
  } else {
    if (!id) {
      setStatus("Informe o ID para a acao Atualizar.", "danger");
      return;
    }

    endpoint = `/${resource}/${encodeURIComponent(id)}`;
  }

  if (method === "POST" || method === "PUT") {
    payload = buildPayloadFromSimpleForm(resource, method);
    if (!payload) {
      setStatus("Preencha os campos obrigatorios do formulario selecionado.", "danger");
      return;
    }
  }

  try {
    const actionLabel = actionLabelByHttpMethod[method] || method;
    setStatus(`Executando ${actionLabel} em ${endpoint}...`);

    const response = await fetchWithFallback(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    const data = await parseResponseJson(response);
    if (!response.ok) {
      const message = data?.error || `Erro HTTP ${response.status}`;
      throw new Error(message);
    }

    const resultTitle = `${actionLabel} ${resource}`;
    renderTable(resultTitle, data || { ok: true });
    setStatus(`Operacao concluida: ${actionLabel} ${endpoint}`, "success");

    const listEndpoint = listRouteByResource[resource];
    const navButtonId = navButtonByResource[resource];
    await fetchGet(listEndpoint, `Lista de ${resource}`, navButtonId);
  } catch (error) {
    setStatus(`Falha na operacao: ${error.message}`, "danger");
  }
}

async function handleTableActionClick(event) {
  // Event delegation: um único listener no <tbody> captura clique nos botões "Excluir".
  const deleteButton = event.target.closest(".btn-row-delete");
  if (!deleteButton) return;

  const resource = deleteButton.dataset.resource;
  const id = deleteButton.dataset.id;

  if (!resource || !id) {
    setStatus("Nao foi possivel identificar o item para exclusao.", "danger");
    return;
  }

  const resourceLabel = resourceLabelByKey[resource] || resource;
  const confirmed = await askDeleteConfirmation(resourceLabel, id);
  if (!confirmed) return;

  try {
    deleteButton.disabled = true;
    setStatus(`Excluindo item ${id} de ${resourceLabel}...`);

    const response = await fetchWithFallback(`/${resource}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const data = await parseResponseJson(response);
    if (!response.ok) {
      const message = data?.error || `Erro HTTP ${response.status}`;
      throw new Error(message);
    }

    setStatus(`Item ${id} excluido com sucesso em ${resourceLabel}.`, "success");
    await fetchGet(
      listRouteByResource[resource],
      `Lista de ${resourceLabel}`,
      navButtonByResource[resource]
    );
  } catch (error) {
    setStatus(`Falha ao excluir item ${id}: ${error.message}`, "danger");
  } finally {
    deleteButton.disabled = false;
  }
}

async function askDeleteConfirmation(resourceLabel, id) {
  // Abre modal Bootstrap e retorna true/false como Promise (confirmou/cancelou).
  if (!deleteConfirmModal || !deleteConfirmText || !btnConfirmDelete) return true;

  deleteConfirmText.textContent = `Confirma excluir o item ${id} de ${resourceLabel}? Essa acao nao pode ser desfeita.`;

  return new Promise((resolve) => {
    deleteConfirmResolver = resolve;
    deleteConfirmModal.show();
  });
}

if (btnConfirmDelete) {
  btnConfirmDelete.addEventListener("click", () => {
    if (deleteConfirmResolver) {
      deleteConfirmResolver(true);
      deleteConfirmResolver = null;
    }
    if (deleteConfirmModal) deleteConfirmModal.hide();
  });
}

if (deleteConfirmModalEl) {
  deleteConfirmModalEl.addEventListener("hidden.bs.modal", () => {
    if (deleteConfirmResolver) {
      deleteConfirmResolver(false);
      deleteConfirmResolver = null;
    }
  });
}

document.getElementById("btnDashboard").addEventListener("click", () => {
  loadDashboard();
});

document.getElementById("btnAdvogados").addEventListener("click", () => {
  fetchGet("/advogados", "Lista de Advogados", "btnAdvogados");
});

document.getElementById("btnClientes").addEventListener("click", () => {
  fetchGet("/clientes", "Lista de Clientes", "btnClientes");
});

document.getElementById("btnEscritorios").addEventListener("click", () => {
  fetchGet("/escritorios", "Lista de Escritorios", "btnEscritorios");
});

document.getElementById("btnProcessos").addEventListener("click", () => {
  fetchGet("/processos", "Lista de Processos", "btnProcessos");
});

formAdvogadoNome.addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = event.target.nome.value.trim();
  if (!nome) return;
  activateNav("btnAdvogados");
  fetchGet(`/advogados/nome/${encodeURIComponent(nome)}`, `Advogado por nome: ${nome}`);
});

formClienteNome.addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = event.target.nome.value.trim();
  if (!nome) return;
  activateNav("btnClientes");
  fetchGet(`/clientes/nome/${encodeURIComponent(nome)}`, `Cliente por nome: ${nome}`);
});

formEscritorioEmail.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = event.target.email.value.trim();
  if (!email) return;
  activateNav("btnEscritorios");
  fetchGet(`/escritorios/email/${encodeURIComponent(email)}`, `Escritorio por email: ${email}`);
});

formEscritorioTelefone.addEventListener("submit", (event) => {
  event.preventDefault();
  const telefone = event.target.telefone.value.trim();
  if (!telefone) return;
  activateNav("btnEscritorios");
  fetchGet(
    `/escritorios/telefone/${encodeURIComponent(telefone)}`,
    `Escritorio por telefone: ${telefone}`
  );
});

tableFilter.addEventListener("input", refreshFilteredTable);
btnClearFilter.addEventListener("click", () => {
  tableFilter.value = "";
  refreshFilteredTable();
});

formWriteOperation.addEventListener("submit", submitWriteOperation);
tableBody.addEventListener("click", handleTableActionClick);
loadDashboard();
