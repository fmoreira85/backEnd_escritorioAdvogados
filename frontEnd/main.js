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
const advogadosNomesList = document.getElementById("advogadosNomesList");
const clientesNomesList = document.getElementById("clientesNomesList");
const escritoriosEmailsList = document.getElementById("escritoriosEmailsList");
const escritoriosTelefonesList = document.getElementById("escritoriosTelefonesList");
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
const entityHelperText = document.getElementById("entityHelperText");
const writeMethod = document.getElementById("writeMethod");
const writeId = document.getElementById("writeId");
const writeMethodField = document.getElementById("writeMethodField");
const writeIdField = document.getElementById("writeIdField");
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
const processEditModalEl = document.getElementById("processEditModal");
const formProcessEdit = document.getElementById("formProcessEdit");
const processEditId = document.getElementById("processEditId");
const processEditEscritorioId = document.getElementById("processEditEscritorioId");
const processEditAdvogadoId = document.getElementById("processEditAdvogadoId");
const processEditClienteId = document.getElementById("processEditClienteId");
const processEditNumero = document.getElementById("processEditNumero");
const processEditTitulo = document.getElementById("processEditTitulo");
const processEditStatus = document.getElementById("processEditStatus");
const processEditDescricao = document.getElementById("processEditDescricao");
const btnSaveProcessEdit = document.getElementById("btnSaveProcessEdit");

const deleteConfirmModal =
  deleteConfirmModalEl && window.bootstrap
    ? new window.bootstrap.Modal(deleteConfirmModalEl)
    : null;
const processEditModal =
  processEditModalEl && window.bootstrap ? new window.bootstrap.Modal(processEditModalEl) : null;
// Resolver da Promise usada para esperar a resposta do usuário no modal de exclusão.
let deleteConfirmResolver = null;
let dashboardChart = null;
const referenceData = {
  escritorios: [],
  advogados: [],
  clientes: [],
};

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

function uniqueById(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = String(row?.id ?? "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildEntityLabel(row, fallbackPrefix) {
  const namePart = row.nome || row.titulo || row.numero || `${fallbackPrefix} ${row.id}`;
  return `${row.id} - ${namePart}`;
}

function setSelectOptions(selectElement, rows, placeholderText, fallbackPrefix) {
  if (!selectElement) return;
  const safeRows = uniqueById(rows);
  const optionsHtml = safeRows
    .map((row) => `<option value="${escapeHtml(String(row.id))}">${escapeHtml(buildEntityLabel(row, fallbackPrefix))}</option>`)
    .join("");
  selectElement.innerHTML = `<option value="">${escapeHtml(placeholderText)}</option>${optionsHtml}`;
}

function setDatalistOptions(datalistElement, values) {
  if (!datalistElement) return;
  const uniqueValues = [...new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))];
  datalistElement.innerHTML = uniqueValues
    .map((value) => `<option value="${escapeHtml(value)}"></option>`)
    .join("");
}

function ensureSelectHasValue(selectElement, value, prefix) {
  if (!selectElement || value == null || value === "") return;
  const valueText = String(value);
  const exists = [...selectElement.options].some((option) => option.value === valueText);
  if (!exists) {
    const option = document.createElement("option");
    option.value = valueText;
    option.textContent = `${valueText} - ${prefix}`;
    selectElement.appendChild(option);
  }
  selectElement.value = valueText;
}

function syncReferenceInputs() {
  setSelectOptions(
    advEscritorioId,
    referenceData.escritorios,
    "Selecione um escritorio *",
    "Escritorio"
  );
  setSelectOptions(
    proEscritorioId,
    referenceData.escritorios,
    "Selecione um escritorio *",
    "Escritorio"
  );
  setSelectOptions(
    processEditEscritorioId,
    referenceData.escritorios,
    "Selecione um escritorio *",
    "Escritorio"
  );
  setSelectOptions(proAdvogadoId, referenceData.advogados, "Selecione um advogado", "Advogado");
  setSelectOptions(
    processEditAdvogadoId,
    referenceData.advogados,
    "Selecione um advogado",
    "Advogado"
  );
  setSelectOptions(proClienteId, referenceData.clientes, "Selecione um cliente", "Cliente");
  setSelectOptions(
    processEditClienteId,
    referenceData.clientes,
    "Selecione um cliente",
    "Cliente"
  );

  setDatalistOptions(
    advogadosNomesList,
    referenceData.advogados.map((row) => row.nome)
  );
  setDatalistOptions(
    clientesNomesList,
    referenceData.clientes.map((row) => row.nome)
  );
  setDatalistOptions(
    escritoriosEmailsList,
    referenceData.escritorios.map((row) => row.email)
  );
  setDatalistOptions(
    escritoriosTelefonesList,
    referenceData.escritorios.map((row) => row.telefone)
  );
}

async function refreshReferenceData(resources = ["escritorios", "advogados", "clientes"]) {
  const tasks = resources.map(async (resource) => {
    try {
      const rows = await fetchCollection(resource);
      referenceData[resource] = rows;
    } catch (_error) {
      referenceData[resource] = [];
    }
  });

  await Promise.all(tasks);
  syncReferenceInputs();
}

function renderRowActions(row) {
  if (row.id == null) return "-";

  const escapedResource = escapeHtml(activeResource);
  const escapedId = escapeHtml(String(row.id));

  if (activeResource === "processos") {
    return `<div class="table-actions">
      <button class="btn btn-outline-primary btn-row-edit-processo" type="button" data-id="${escapedId}">Editar</button>
      <button class="btn btn-danger btn-row-delete" type="button" data-resource="${escapedResource}" data-id="${escapedId}">Excluir</button>
    </div>`;
  }

  return `<button class="btn btn-danger btn-row-delete" type="button" data-resource="${escapedResource}" data-id="${escapedId}">Excluir</button>`;
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
            ? `<td>${renderRowActions(row)}</td>`
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
    resultsPanel.hidden = isDashboard;

    if (isDashboard) {
      kpiModulo.textContent = "Dashboard";
      return;
    }

    toggleFilterForms(resource);
    writeResource.value = resource;
    writeResourceLabel.textContent = resourceLabelByKey[resource] || resource;
    updateWriteFormMode(resource);
    toggleSimpleForms();

    if (resource === "advogados") {
      void refreshReferenceData(["escritorios", "advogados"]);
      return;
    }

    if (resource === "clientes") {
      void refreshReferenceData(["clientes"]);
      return;
    }

    if (resource === "escritorios") {
      void refreshReferenceData(["escritorios"]);
      return;
    }

    if (resource === "processos") {
      void refreshReferenceData(["escritorios", "advogados", "clientes"]);
    }
  }
}

function toNumberOrNull(value) {
  const text = String(value ?? "").trim();
  return text ? Number(text) : null;
}

function updateWriteFormMode(resource) {
  const isProcessos = resource === "processos";
  if (writeMethodField) writeMethodField.hidden = isProcessos;
  if (writeIdField) writeIdField.hidden = isProcessos;

  if (isProcessos) {
    writeMethod.value = "criar";
  }
  writeMethod.disabled = isProcessos;

  if (isProcessos) {
    writeId.value = "";
  }
  writeId.disabled = isProcessos;

  if (entityHelperText) {
    entityHelperText.textContent = isProcessos
      ? "Na secao de Processos o formulario cria novos processos. Para editar, use o botao Editar na tabela."
      : "Use Criar para novo cadastro e Atualizar para editar um item existente.";
  }
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
  if (escritorio_id == null) return null;

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

function findProcessRowById(id) {
  return lastRenderedRows.find((row) => String(row.id) === String(id));
}

function fillProcessEditForm(row) {
  processEditId.value = String(row.id ?? "");
  processEditEscritorioId.value = row.escritorio_id ?? "";
  processEditAdvogadoId.value = row.advogado_id ?? "";
  processEditClienteId.value = row.cliente_id ?? "";
  processEditNumero.value = row.numero ?? "";
  processEditTitulo.value = row.titulo ?? "";
  processEditStatus.value = row.status ?? "";
  processEditDescricao.value = row.descricao ?? "";
}

function buildProcessoPayloadFromModal() {
  const escritorioId = toNumberOrNull(processEditEscritorioId.value);
  if (escritorioId == null) return null;

  return {
    escritorio_id: escritorioId,
    advogado_id: toNumberOrNull(processEditAdvogadoId.value),
    cliente_id: toNumberOrNull(processEditClienteId.value),
    numero: processEditNumero.value.trim() || null,
    titulo: processEditTitulo.value.trim() || null,
    status: processEditStatus.value.trim() || null,
    descricao: processEditDescricao.value.trim() || null,
  };
}

async function openProcessEditModal(id) {
  if (!processEditModal) {
    setStatus("Modal de edicao indisponivel no momento.", "danger");
    return;
  }

  const row = findProcessRowById(id);
  if (!row) {
    setStatus(`Nao foi possivel localizar os dados do processo ${id} na tabela.`, "danger");
    return;
  }

  await refreshReferenceData(["escritorios", "advogados", "clientes"]);
  fillProcessEditForm(row);
  ensureSelectHasValue(processEditEscritorioId, row.escritorio_id, "Escritorio");
  ensureSelectHasValue(processEditAdvogadoId, row.advogado_id, "Advogado");
  ensureSelectHasValue(processEditClienteId, row.cliente_id, "Cliente");
  processEditModal.show();
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

    setStatus(`Dashboard atualizado (${activeApiBase}).`, "success");
  } catch (error) {
    dashAdvogados.textContent = "0";
    dashClientes.textContent = "0";
    dashEscritorios.textContent = "0";
    dashProcessos.textContent = "0";
    updateDashboardChart([0, 0, 0, 0]);
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
          backgroundColor: ["#2563eb", "#f97316", "#10b981", "#a855f7"],
          borderColor: ["#1d4ed8", "#c2410c", "#047857", "#7e22ce"],
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
    await refreshReferenceData(["escritorios", "advogados", "clientes"]);

    const listEndpoint = listRouteByResource[resource];
    const navButtonId = navButtonByResource[resource];
    await fetchGet(listEndpoint, `Lista de ${resource}`, navButtonId);
  } catch (error) {
    setStatus(`Falha na operacao: ${error.message}`, "danger");
  }
}

async function submitProcessEdit() {
  const id = processEditId.value.trim();
  if (!id) {
    setStatus("ID do processo invalido para edicao.", "danger");
    return;
  }

  const payload = buildProcessoPayloadFromModal();
  if (!payload) {
    setStatus("No modal de edicao, informe ao menos o Escritorio ID.", "danger");
    return;
  }

  try {
    btnSaveProcessEdit.disabled = true;
    setStatus(`Atualizando processo ${id}...`);

    const response = await fetchWithFallback(`/processos/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponseJson(response);
    if (!response.ok) {
      const message = data?.error || `Erro HTTP ${response.status}`;
      throw new Error(message);
    }

    if (processEditModal) processEditModal.hide();
    setStatus(`Processo ${id} atualizado com sucesso.`, "success");
    await refreshReferenceData(["escritorios", "advogados", "clientes"]);
    await fetchGet("/processos", "Lista de Processos", "btnProcessos");
  } catch (error) {
    setStatus(`Falha ao atualizar processo ${id}: ${error.message}`, "danger");
  } finally {
    btnSaveProcessEdit.disabled = false;
  }
}

async function handleTableActionClick(event) {
  // Event delegation: um único listener no <tbody> captura clique nos botões de ação.
  const editButton = event.target.closest(".btn-row-edit-processo");
  if (editButton) {
    const id = editButton.dataset.id;
    if (!id) {
      setStatus("Nao foi possivel identificar o processo para edicao.", "danger");
      return;
    }
    await openProcessEditModal(id);
    return;
  }

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
    await refreshReferenceData(["escritorios", "advogados", "clientes"]);
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

if (btnSaveProcessEdit) {
  btnSaveProcessEdit.addEventListener("click", submitProcessEdit);
}

if (formProcessEdit) {
  formProcessEdit.addEventListener("submit", (event) => {
    event.preventDefault();
    submitProcessEdit();
  });
}

if (processEditModalEl) {
  processEditModalEl.addEventListener("hidden.bs.modal", () => {
    if (formProcessEdit) formProcessEdit.reset();
    processEditId.value = "";
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
void refreshReferenceData(["escritorios", "advogados", "clientes"]);
loadDashboard();
