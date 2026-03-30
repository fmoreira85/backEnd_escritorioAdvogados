import {
  CONFIG,
  actionLabelByHttpMethod,
  actionToHttpMethod,
  buildApiBaseCandidates,
  createRouteByResource,
  listRouteByResource,
  navButtonByResource,
  resourceByNavButton,
  resourceLabelByKey,
} from "./src/scripts/app-config.js";

const FRONTEND_CONSTANTS = {
  ACTIVE_FLAG_DEFAULT: 1,
  STATUS_SORT_FALLBACK_ORDER: 99,
  PERCENT_SCALE: 100,
  HTTP_NOT_FOUND: 404,
  HTTP_METHOD_NOT_ALLOWED: 405,
};

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
const dashboardStatusCharts = document.getElementById("dashboardStatusCharts");
const btnDashboardStatusClear = document.getElementById("btnDashboardStatusClear");
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
const entityEditModalEl = document.getElementById("entityEditModal");
const entityEditModalLabel = document.getElementById("entityEditModalLabel");
const formEntityEdit = document.getElementById("formEntityEdit");
const entityEditResource = document.getElementById("entityEditResource");
const entityEditId = document.getElementById("entityEditId");
const entityEditAdvogados = document.getElementById("entityEditAdvogados");
const entityEditClientes = document.getElementById("entityEditClientes");
const entityEditEscritorios = document.getElementById("entityEditEscritorios");
const editAdvEscritorioId = document.getElementById("editAdvEscritorioId");
const editAdvNome = document.getElementById("editAdvNome");
const editAdvOab = document.getElementById("editAdvOab");
const editAdvEspecialidade = document.getElementById("editAdvEspecialidade");
const editAdvEmail = document.getElementById("editAdvEmail");
const editAdvTelefone = document.getElementById("editAdvTelefone");
const editAdvAtivo = document.getElementById("editAdvAtivo");
const editCliNome = document.getElementById("editCliNome");
const editCliDocumento = document.getElementById("editCliDocumento");
const editCliEmail = document.getElementById("editCliEmail");
const editCliTelefone = document.getElementById("editCliTelefone");
const editCliEndereco = document.getElementById("editCliEndereco");
const editCliCidade = document.getElementById("editCliCidade");
const editCliEstado = document.getElementById("editCliEstado");
const editCliCep = document.getElementById("editCliCep");
const editEscNome = document.getElementById("editEscNome");
const editEscCnpj = document.getElementById("editEscCnpj");
const editEscEmail = document.getElementById("editEscEmail");
const editEscTelefone = document.getElementById("editEscTelefone");
const editEscEndereco = document.getElementById("editEscEndereco");
const editEscCidade = document.getElementById("editEscCidade");
const editEscEstado = document.getElementById("editEscEstado");
const editEscCep = document.getElementById("editEscCep");
const btnSaveEntityEdit = document.getElementById("btnSaveEntityEdit");

const deleteConfirmModal =
  deleteConfirmModalEl && window.bootstrap
    ? new window.bootstrap.Modal(deleteConfirmModalEl)
    : null;
const processEditModal =
  processEditModalEl && window.bootstrap ? new window.bootstrap.Modal(processEditModalEl) : null;
const entityEditModal =
  entityEditModalEl && window.bootstrap ? new window.bootstrap.Modal(entityEditModalEl) : null;
// Resolver da Promise usada para esperar a resposta do usuário no modal de exclusão.
let deleteConfirmResolver = null;
let dashboardChart = null;
let dashboardStatusChartsInstances = [];
let dashboardProcessRows = [];
let dashboardSelectedStatus = "";
let processRowBeingEdited = null;
const referenceData = {
  escritorios: [],
  advogados: [],
  clientes: [],
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

function ensureSelectHasPlainValue(selectElement, value) {
  if (!selectElement || value == null || value === "") return;
  const valueText = String(value);
  const exists = [...selectElement.options].some((option) => option.value === valueText);
  if (!exists) {
    const option = document.createElement("option");
    option.value = valueText;
    option.textContent = valueText;
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
    editAdvEscritorioId,
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

async function refreshReferenceData(resourceKeys = ["escritorios", "advogados", "clientes"]) {
  const tasks = resourceKeys.map(async (resourceKey) => {
    try {
      const collectionRows = await fetchCollection(resourceKey);
      referenceData[resourceKey] = collectionRows;
    } catch (_error) {
      referenceData[resourceKey] = [];
    }
  });

  await Promise.all(tasks);
  syncReferenceInputs();
}

function renderRowActions(row) {
  if (row.id == null) return "-";

  const escapedResource = escapeHtml(activeResource);
  const escapedId = escapeHtml(String(row.id));
  const isEntityModule = ["advogados", "clientes", "escritorios", "processos"].includes(
    activeResource
  );
  if (!isEntityModule) return "-";

  const actionClass =
    activeResource === "processos" ? "table-actions table-actions-processos" : "table-actions";

  return `<div class="${actionClass}">
    <button class="btn btn-outline-primary btn-row-edit-entity" type="button" data-resource="${escapedResource}" data-id="${escapedId}">Editar</button>
    <button class="btn btn-danger btn-row-delete" type="button" data-resource="${escapedResource}" data-id="${escapedId}">Excluir</button>
  </div>`;
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

function renderTable(title, responsePayload) {
  // "responsePayload" pode vir como objeto único ou array; aqui normalizamos para array.
  const records = normalizeRows(responsePayload);
  const columns = [...new Set(records.flatMap((record) => Object.keys(record)))];

  tableTitle.textContent = title;

  lastRenderedRows = records;
  lastRenderedColumns = columns;
  refreshFilteredTable();
}

function setActiveNavButton(buttonId) {
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.id === buttonId);
  });
}

function getResourceByButtonId(buttonId) {
  return resourceByNavButton[buttonId] || null;
}

function updateActiveModuleLabel(buttonId) {
  const activeName = document.getElementById(buttonId)?.textContent?.trim() || "-";
  kpiModulo.textContent = activeName;
}

function applyScreenLayoutByResource(resourceKey) {
  const isDashboard = resourceKey === "dashboard";
  dashboardPanel.hidden = !isDashboard;
  filtersPanel.hidden = isDashboard;
  writePanel.hidden = isDashboard;
  resultsPanel.hidden = isDashboard;
  if (isDashboard) kpiModulo.textContent = "Dashboard";
}

function syncWriteSectionForResource(resourceKey) {
  toggleFilterForms(resourceKey);
  writeResource.value = resourceKey;
  writeResourceLabel.textContent = resourceLabelByKey[resourceKey] || resourceKey;
  updateWriteFormMode(resourceKey);
  toggleSimpleForms();
}

function refreshReferenceDataForResource(resourceKey) {
  const referenceResourcesByModule = {
    advogados: ["escritorios", "advogados"],
    clientes: ["clientes"],
    escritorios: ["escritorios"],
    processos: ["escritorios", "advogados", "clientes"],
  };
  const referenceKeys = referenceResourcesByModule[resourceKey];
  if (!referenceKeys) return;
  void refreshReferenceData(referenceKeys);
}

function activateNav(buttonId) {
  // Orquestra navegação; regras de layout e dados ficam em funções específicas.
  setActiveNavButton(buttonId);
  updateActiveModuleLabel(buttonId);

  const resourceKey = getResourceByButtonId(buttonId);
  if (!resourceKey) return;

  activeResource = resourceKey;
  applyScreenLayoutByResource(resourceKey);
  if (resourceKey === "dashboard") return;

  syncWriteSectionForResource(resourceKey);
  refreshReferenceDataForResource(resourceKey);
}

function toNumberOrNull(value) {
  const text = String(value ?? "").trim();
  return text ? Number(text) : null;
}

function updateWriteFormMode(resource) {
  const isEntity = ["advogados", "clientes", "escritorios", "processos"].includes(resource);
  if (writeMethodField) writeMethodField.hidden = isEntity;
  if (writeIdField) writeIdField.hidden = isEntity;
  if (isEntity) writeMethod.value = "criar";
  writeMethod.disabled = isEntity;
  if (isEntity) writeId.value = "";
  writeId.disabled = isEntity;

  if (entityHelperText) {
    entityHelperText.textContent =
      "Este formulario e apenas para criar novos registros. Para editar, use o botao Editar na tabela.";
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
    status: toProcessStatusApiValue(proStatus.value),
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
  ensureSelectHasPlainValue(processEditStatus, row.status);
  processEditDescricao.value = row.descricao ?? "";
}

function buildProcessoPayloadFromModal() {
  const escritorioId =
    toNumberOrNull(processEditEscritorioId.value) ??
    toNumberOrNull(processRowBeingEdited?.escritorio_id);
  if (escritorioId == null) return null;

  return {
    escritorio_id: escritorioId,
    advogado_id:
      toNumberOrNull(processEditAdvogadoId.value) ??
      toNumberOrNull(processRowBeingEdited?.advogado_id),
    cliente_id:
      toNumberOrNull(processEditClienteId.value) ??
      toNumberOrNull(processRowBeingEdited?.cliente_id),
    numero: processEditNumero.value.trim() || processRowBeingEdited?.numero || null,
    titulo: processEditTitulo.value.trim() || processRowBeingEdited?.titulo || null,
    status: toProcessStatusApiValue(
      processEditStatus.value || processRowBeingEdited?.status || "aberto"
    ),
    descricao: processEditDescricao.value.trim() || processRowBeingEdited?.descricao || null,
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

  processRowBeingEdited = row;
  await refreshReferenceData(["escritorios", "advogados", "clientes"]);
  fillProcessEditForm(row);
  ensureSelectHasValue(processEditEscritorioId, row.escritorio_id, "Escritorio");
  ensureSelectHasValue(processEditAdvogadoId, row.advogado_id, "Advogado");
  ensureSelectHasValue(processEditClienteId, row.cliente_id, "Cliente");
  processEditModal.show();
}

function findEntityRowById(id) {
  return lastRenderedRows.find((row) => String(row.id) === String(id));
}

function toggleEntityEditSections(resource) {
  entityEditAdvogados.hidden = resource !== "advogados";
  entityEditClientes.hidden = resource !== "clientes";
  entityEditEscritorios.hidden = resource !== "escritorios";
}

function fillAdvogadoEditForm(row) {
  editAdvEscritorioId.value = row.escritorio_id ?? "";
  ensureSelectHasValue(editAdvEscritorioId, row.escritorio_id, "Escritorio");
  editAdvNome.value = row.nome ?? "";
  editAdvOab.value = row.oab ?? "";
  editAdvEspecialidade.value = row.especialidade ?? "";
  editAdvEmail.value = row.email ?? "";
  editAdvTelefone.value = row.telefone ?? "";
  editAdvAtivo.value = String(row.ativo ?? FRONTEND_CONSTANTS.ACTIVE_FLAG_DEFAULT);
}

function fillClienteEditForm(row) {
  editCliNome.value = row.nome ?? "";
  editCliDocumento.value = row.documento ?? "";
  editCliEmail.value = row.email ?? "";
  editCliTelefone.value = row.telefone ?? "";
  editCliEndereco.value = row.endereco ?? "";
  editCliCidade.value = row.cidade ?? "";
  editCliEstado.value = row.estado ?? "";
  editCliCep.value = row.cep ?? "";
}

function fillEscritorioEditForm(row) {
  editEscNome.value = row.nome ?? "";
  editEscCnpj.value = row.cnpj ?? "";
  editEscEmail.value = row.email ?? "";
  editEscTelefone.value = row.telefone ?? "";
  editEscEndereco.value = row.endereco ?? "";
  editEscCidade.value = row.cidade ?? "";
  editEscEstado.value = row.estado ?? "";
  editEscCep.value = row.cep ?? "";
}

async function openEntityEditModal(resource, id) {
  if (!entityEditModal) {
    setStatus("Modal de edicao indisponivel no momento.", "danger");
    return;
  }

  const row = findEntityRowById(id);
  if (!row) {
    setStatus(`Nao foi possivel localizar os dados do item ${id} para edicao.`, "danger");
    return;
  }

  if (resource === "advogados") {
    await refreshReferenceData(["escritorios"]);
    fillAdvogadoEditForm(row);
  } else if (resource === "clientes") {
    fillClienteEditForm(row);
  } else if (resource === "escritorios") {
    fillEscritorioEditForm(row);
  } else {
    setStatus("Tipo de recurso nao suportado para este modal de edicao.", "danger");
    return;
  }

  entityEditResource.value = resource;
  entityEditId.value = String(id);
  toggleEntityEditSections(resource);
  if (entityEditModalLabel) {
    const label = resourceLabelByKey[resource] || resource;
    entityEditModalLabel.textContent = `Editar ${label.slice(0, -1) || label}`;
  }
  entityEditModal.show();
}

function buildAdvogadoPayloadFromEditModal() {
  const escritorioId = toNumberOrNull(editAdvEscritorioId.value);
  const nome = editAdvNome.value.trim();
  const oab = editAdvOab.value.trim();
  if (escritorioId == null || !nome || !oab) return null;

  return {
    escritorio_id: escritorioId,
    nome,
    oab,
    especialidade: editAdvEspecialidade.value.trim() || null,
    email: editAdvEmail.value.trim() || null,
    telefone: editAdvTelefone.value.trim() || null,
    ativo: Number(editAdvAtivo.value || FRONTEND_CONSTANTS.ACTIVE_FLAG_DEFAULT),
  };
}

function buildClientePayloadFromEditModal() {
  const nome = editCliNome.value.trim();
  if (!nome) return null;

  return {
    nome,
    documento: editCliDocumento.value.trim() || null,
    email: editCliEmail.value.trim() || null,
    telefone: editCliTelefone.value.trim() || null,
    endereco: editCliEndereco.value.trim() || null,
    cidade: editCliCidade.value.trim() || null,
    estado: editCliEstado.value.trim() || null,
    cep: editCliCep.value.trim() || null,
  };
}

function buildEscritorioPayloadFromEditModal() {
  const nome = editEscNome.value.trim();
  const cnpj = editEscCnpj.value.trim();
  if (!nome || !cnpj) return null;

  return {
    nome,
    cnpj,
    email: editEscEmail.value.trim() || null,
    telefone: editEscTelefone.value.trim() || null,
    endereco: editEscEndereco.value.trim() || null,
    cidade: editEscCidade.value.trim() || null,
    estado: editEscEstado.value.trim() || null,
    cep: editEscCep.value.trim() || null,
  };
}

function buildEntityEditPayload(resource) {
  if (resource === "advogados") return buildAdvogadoPayloadFromEditModal();
  if (resource === "clientes") return buildClientePayloadFromEditModal();
  if (resource === "escritorios") return buildEscritorioPayloadFromEditModal();
  return null;
}

async function fetchWithFallback(endpoint, options = {}) {
  // Tenta cada URL candidata da API até encontrar uma que responda.
  let lastFetchError = null;
  const authToken = window.localStorage.getItem("AUTH_TOKEN");
  const mergedHeaders = {
    ...(options.headers || {}),
  };
  if (authToken && !mergedHeaders.Authorization) {
    mergedHeaders.Authorization = `Bearer ${authToken}`;
  }
  const requestOptions = {
    ...options,
    headers: mergedHeaders,
  };

  for (const base of API_BASE_CANDIDATES) {
    try {
      const apiResponse = await fetch(`${base}${endpoint}`, requestOptions);
      activeApiBase = base;
      return apiResponse;
    } catch (error) {
      lastFetchError = error;
    }
  }

  throw (
    lastFetchError ||
    new Error(`Nao foi possivel conectar com a API (${API_BASE_CANDIDATES.join(", ")})`)
  );
}

async function parseResponseJson(apiResponse) {
  const contentType = apiResponse.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  try {
    return await apiResponse.json();
  } catch (_error) {
    return null;
  }
}

async function fetchGet(endpoint, title, navButtonId = "") {
  // Fluxo padrão para consultas GET e renderização da tabela.
  try {
    setStatus(`Consultando ${endpoint} em ${activeApiBase}...`);
    if (navButtonId) activateNav(navButtonId);

    const apiResponse = await fetchWithFallback(endpoint);
    const responsePayload = await parseResponseJson(apiResponse);

    if (!apiResponse.ok) {
      const message = responsePayload?.error || `Erro HTTP ${apiResponse.status}`;
      throw new Error(message);
    }

    renderTable(title, responsePayload || []);
    setStatus(`Consulta concluida: ${endpoint} (${activeApiBase})`, "success");
  } catch (error) {
    renderTable(title, []);

    const guidance =
      error.message === "Failed to fetch"
        ? `Falha de conexao com a API. Confirme se o backend esta rodando na porta ${CONFIG.API_PORT}.`
        : error.message.includes("401") || error.message.includes("403")
          ? "Acesso negado. Defina AUTH_TOKEN no localStorage apos login em /auth/login."
        : error.message;

    setStatus(`Falha: ${guidance}`, "danger");
  }
}

async function fetchCollection(resourceKey) {
  // Helper para buscar coleção completa de uma entidade (usado no dashboard).
  const apiResponse = await fetchWithFallback(listRouteByResource[resourceKey]);
  const collectionPayload = await parseResponseJson(apiResponse);
  if (!apiResponse.ok) {
    const message = collectionPayload?.error || `Erro HTTP ${apiResponse.status}`;
    throw new Error(message);
  }
  return Array.isArray(collectionPayload) ? collectionPayload : [];
}

async function loadDashboard() {
  // Carrega os 4 módulos em paralelo para montar os indicadores rapidamente.
  activateNav("btnDashboard");
  setStatus("Carregando indicadores operacionais...", "neutral");
  renderDashboardStatusSkeleton();

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
    dashboardProcessRows = processos;
    updateDashboardChart([
      advogados.length,
      clientes.length,
      escritorios.length,
      processos.length,
    ]);
    updateProcessStatusCharts(processos);

    setStatus(`Dashboard atualizado (${activeApiBase}).`, "success");
  } catch (error) {
    dashAdvogados.textContent = "0";
    dashClientes.textContent = "0";
    dashEscritorios.textContent = "0";
    dashProcessos.textContent = "0";
    dashboardProcessRows = [];
    updateDashboardChart([0, 0, 0, 0]);
    updateProcessStatusCharts([]);
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
          backgroundColor: CONFIG.DASHBOARD_TOTAL_BACKGROUND_COLORS,
          borderColor: CONFIG.DASHBOARD_TOTAL_BORDER_COLORS,
          borderWidth: CONFIG.CHART_BORDER_WIDTH,
          borderRadius: CONFIG.CHART_BORDER_RADIUS,
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
            stepSize: CONFIG.CHART_STEP_SIZE,
          },
        },
      },
    },
  });
}

function normalizeProcessStatus(value) {
  const statusRaw = String(value ?? "").trim().toLowerCase();
  if (!statusRaw) return "Sem status";
  return CONFIG.STATUS_LABEL_BY_API[statusRaw] || String(value).trim();
}

function toProcessStatusApiValue(value) {
  const statusRaw = String(value ?? "").trim();
  if (!statusRaw) return "aberto";
  const statusFromLabel = CONFIG.STATUS_API_BY_LABEL[statusRaw];
  if (statusFromLabel) return statusFromLabel;
  const normalizedRaw = statusRaw.toLowerCase();
  if (CONFIG.STATUS_LABEL_BY_API[normalizedRaw]) {
    return normalizedRaw === "em andamento" ? "andamento" : normalizedRaw;
  }
  return "aberto";
}

function getFilterTermForStatusLabel(label) {
  return CONFIG.STATUS_API_BY_LABEL[label] || label;
}

function getStatusColor(label) {
  return CONFIG.STATUS_COLOR_BY_LABEL[label] || CONFIG.CHART_FALLBACK_COLOR;
}

function destroyDashboardStatusCharts() {
  dashboardStatusChartsInstances.forEach((instance) => instance.destroy());
  dashboardStatusChartsInstances = [];
}

function renderDashboardStatusSkeleton() {
  if (!dashboardStatusCharts) return;
  destroyDashboardStatusCharts();
  dashboardStatusCharts.innerHTML = new Array(CONFIG.DASHBOARD_STATUS_SKELETON_COUNT)
    .fill('<div class="status-chart-skeleton" aria-hidden="true"></div>')
    .join("");
}

async function openProcessListByStatus(status) {
  dashboardSelectedStatus = status;
  tableFilter.value = getFilterTermForStatusLabel(status);
  await fetchGet("/processos", "Lista de Processos", "btnProcessos");
  setStatus(`Processos filtrados por status: ${status}.`, "success");
}

async function openAllProcessesFromDashboard() {
  dashboardSelectedStatus = "";
  tableFilter.value = "";
  await fetchGet("/processos", "Lista de Processos", "btnProcessos");
}

function buildProcessStatusCounts(processRows) {
  const statusCountMap = new Map();
  processRows.forEach((processRow) => {
    const statusLabel = normalizeProcessStatus(processRow.status);
    statusCountMap.set(statusLabel, (statusCountMap.get(statusLabel) || 0) + 1);
  });
  return statusCountMap;
}

function sortStatusLabels(statusCountMap) {
  return [...statusCountMap.keys()].sort((leftLabel, rightLabel) => {
    const leftIndex = CONFIG.STATUS_ORDER.indexOf(leftLabel);
    const rightIndex = CONFIG.STATUS_ORDER.indexOf(rightLabel);
    const leftOrder =
      leftIndex === -1 ? FRONTEND_CONSTANTS.STATUS_SORT_FALLBACK_ORDER : leftIndex;
    const rightOrder =
      rightIndex === -1 ? FRONTEND_CONSTANTS.STATUS_SORT_FALLBACK_ORDER : rightIndex;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return leftLabel.localeCompare(rightLabel, "pt-BR");
  });
}

function buildProcessStatusCardHtml(statusLabel, statusCount, totalProcesses, chartIndex) {
  const statusPercent = Math.round(
    (statusCount / totalProcesses) * FRONTEND_CONSTANTS.PERCENT_SCALE
  );
  const isSelected = dashboardSelectedStatus === statusLabel;
  return `
      <article class="status-chart-card">
        <button
          type="button"
          class="status-chart-button ${isSelected ? "is-selected" : ""}"
          data-status="${escapeHtml(statusLabel)}"
          aria-pressed="${isSelected ? "true" : "false"}"
          aria-label="Filtrar processos com status ${escapeHtml(statusLabel)}"
        >
          <div class="status-chart-header">
            <p class="status-chart-label">${escapeHtml(statusLabel)}</p>
            <p class="status-chart-count">${escapeHtml(String(statusCount))}</p>
          </div>
          <p class="status-chart-percent">${escapeHtml(`${statusPercent}% dos processos`)}</p>
          <div class="status-chart-progress">
            <span style="width:${escapeHtml(String(statusPercent))}%; background:${escapeHtml(
    getStatusColor(statusLabel)
  )};"></span>
          </div>
          <div class="status-chart-canvas-wrap">
            <canvas id="statusChart_${chartIndex}" aria-label="Grafico do status ${escapeHtml(
    statusLabel
  )}"></canvas>
          </div>
        </button>
      </article>
    `;
}

function createProcessStatusChart(statusLabel, statusCount, totalProcesses, chartIndex) {
  const chartCanvas = document.getElementById(`statusChart_${chartIndex}`);
  if (!chartCanvas) return;

  const statusColor = getStatusColor(statusLabel);
  const chartInstance = new window.Chart(chartCanvas, {
    type: "doughnut",
    data: {
      labels: [statusLabel, "Outros"],
      datasets: [
        {
          data: [statusCount, Math.max(totalProcesses - statusCount, 0)],
          backgroundColor: [statusColor, CONFIG.CHART_OTHER_SLICE_COLOR],
          borderColor: CONFIG.CHART_BORDER_COLOR,
          borderWidth: CONFIG.CHART_BORDER_WIDTH,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
    },
  });

  dashboardStatusChartsInstances.push(chartInstance);
}

function updateProcessStatusCharts(processRows) {
  if (!dashboardStatusCharts) return;

  destroyDashboardStatusCharts();

  const totalProcesses = processRows.length;
  if (!window.Chart || totalProcesses === 0) {
    dashboardStatusCharts.innerHTML =
      '<p class="status-chart-empty">Nenhum processo para exibir status no momento.</p>';
    return;
  }

  const statusCountMap = buildProcessStatusCounts(processRows);
  const orderedStatusLabels = sortStatusLabels(statusCountMap);

  dashboardStatusCharts.innerHTML = orderedStatusLabels
    .map((statusLabel, chartIndex) =>
      buildProcessStatusCardHtml(
        statusLabel,
        statusCountMap.get(statusLabel) || 0,
        totalProcesses,
        chartIndex
      )
    )
    .join("");

  orderedStatusLabels.forEach((statusLabel, chartIndex) => {
    createProcessStatusChart(
      statusLabel,
      statusCountMap.get(statusLabel) || 0,
      totalProcesses,
      chartIndex
    );
  });
}

function getWriteOperationContext() {
  return {
    resourceKey: writeResource.value,
    httpMethod: actionToHttpMethod[writeMethod.value],
    targetId: writeId.value.trim(),
  };
}

function validateWriteOperationContext(writeContext) {
  if (!writeContext.httpMethod) return "Acao invalida. Recarregue a pagina e tente novamente.";
  if (writeContext.httpMethod === "DELETE") {
    return "Exclusao permitida apenas pelo botao Excluir na tabela.";
  }
  if (writeContext.httpMethod === "PUT" && !writeContext.targetId) {
    return "Informe o ID para a acao Atualizar.";
  }
  return "";
}

function buildWriteTargetEndpoint(writeContext) {
  if (writeContext.httpMethod === "POST") {
    return createRouteByResource[writeContext.resourceKey];
  }
  return `/${writeContext.resourceKey}/${encodeURIComponent(writeContext.targetId)}`;
}

function buildWriteRequestPayload(writeContext) {
  if (!["POST", "PUT"].includes(writeContext.httpMethod)) return null;
  return buildPayloadFromSimpleForm(writeContext.resourceKey, writeContext.httpMethod);
}

async function executeWriteOperationRequest(writeContext, targetEndpoint, requestPayload) {
  const actionLabel = actionLabelByHttpMethod[writeContext.httpMethod] || writeContext.httpMethod;
  setStatus(`Executando ${actionLabel} em ${targetEndpoint}...`);

  const apiResponse = await fetchWithFallback(targetEndpoint, {
    method: writeContext.httpMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: requestPayload ? JSON.stringify(requestPayload) : undefined,
  });

  const responsePayload = await parseResponseJson(apiResponse);
  if (!apiResponse.ok) {
    const message = responsePayload?.error || `Erro HTTP ${apiResponse.status}`;
    throw new Error(message);
  }

  return {
    actionLabel,
    responsePayload,
  };
}

async function refreshResourceListAfterWrite(resourceKey) {
  const listEndpoint = listRouteByResource[resourceKey];
  const navButtonId = navButtonByResource[resourceKey];
  await fetchGet(listEndpoint, `Lista de ${resourceKey}`, navButtonId);
}

async function submitWriteOperation(event) {
  // Aqui tratamos "Criar" e "Atualizar" do formulário principal.
  // Exclusão foi propositalmente removida deste fluxo para evitar erros de UX.
  event.preventDefault();

  const writeContext = getWriteOperationContext();
  const validationError = validateWriteOperationContext(writeContext);
  if (validationError) {
    setStatus(validationError, "danger");
    return;
  }

  const targetEndpoint = buildWriteTargetEndpoint(writeContext);
  const requestPayload = buildWriteRequestPayload(writeContext);
  if (["POST", "PUT"].includes(writeContext.httpMethod) && !requestPayload) {
    setStatus("Preencha os campos obrigatorios do formulario selecionado.", "danger");
    return;
  }

  try {
    const { actionLabel, responsePayload } = await executeWriteOperationRequest(
      writeContext,
      targetEndpoint,
      requestPayload
    );

    const resultTitle = `${actionLabel} ${writeContext.resourceKey}`;
    renderTable(resultTitle, responsePayload || { ok: true });
    setStatus(`Operacao concluida: ${actionLabel} ${targetEndpoint}`, "success");
    await refreshReferenceData(["escritorios", "advogados", "clientes"]);
    await refreshResourceListAfterWrite(writeContext.resourceKey);
  } catch (error) {
    setStatus(`Falha na operacao: ${error.message}`, "danger");
  }
}

async function submitProcessEdit() {
  const processId = processEditId.value.trim();
  if (!processId) {
    setStatus("ID do processo invalido para edicao.", "danger");
    return;
  }

  const processPayload = buildProcessoPayloadFromModal();
  if (!processPayload) {
    setStatus("No modal de edicao, informe ao menos o Escritorio ID.", "danger");
    return;
  }

  try {
    btnSaveProcessEdit.disabled = true;
    setStatus(`Atualizando processo ${processId}...`);
    const updateEndpoints = [
      `/processos/${encodeURIComponent(processId)}`,
      `/atualizar-processo/${encodeURIComponent(processId)}`,
    ];
    let processUpdated = false;
    let updateError = null;

    for (const updateEndpoint of updateEndpoints) {
      const apiResponse = await fetchWithFallback(updateEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processPayload),
      });

      const responsePayload = await parseResponseJson(apiResponse);
      if (apiResponse.ok) {
        processUpdated = true;
        break;
      }

      updateError = new Error(
        responsePayload?.error || `Erro HTTP ${apiResponse.status} (${updateEndpoint})`
      );
      // Mantemos fallback apenas quando a rota claramente nao existe.
      if (
        apiResponse.status !== FRONTEND_CONSTANTS.HTTP_NOT_FOUND &&
        apiResponse.status !== FRONTEND_CONSTANTS.HTTP_METHOD_NOT_ALLOWED
      ) {
        throw updateError;
      }
    }

    if (!processUpdated) {
      throw updateError || new Error("Nao foi possivel atualizar o processo.");
    }

    if (processEditModal) processEditModal.hide();
    setStatus(`Processo ${processId} atualizado com sucesso.`, "success");
    await refreshReferenceData(["escritorios", "advogados", "clientes"]);
    await fetchGet("/processos", "Lista de Processos", "btnProcessos");
  } catch (error) {
    setStatus(`Falha ao atualizar processo ${processId}: ${error.message}`, "danger");
  } finally {
    btnSaveProcessEdit.disabled = false;
  }
}

async function submitEntityEdit() {
  const resourceKey = entityEditResource.value;
  const entityId = entityEditId.value.trim();
  if (!resourceKey || !entityId) {
    setStatus("Dados insuficientes para atualizar este registro.", "danger");
    return;
  }

  const entityPayload = buildEntityEditPayload(resourceKey);
  if (!entityPayload) {
    setStatus("Preencha os campos obrigatorios do formulario de edicao.", "danger");
    return;
  }

  try {
    if (btnSaveEntityEdit) btnSaveEntityEdit.disabled = true;
    setStatus(`Atualizando ${resourceKey} ${entityId}...`);

    const apiResponse = await fetchWithFallback(`/${resourceKey}/${encodeURIComponent(entityId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entityPayload),
    });

    const responsePayload = await parseResponseJson(apiResponse);
    if (!apiResponse.ok) {
      const message = responsePayload?.error || `Erro HTTP ${apiResponse.status}`;
      throw new Error(message);
    }

    if (entityEditModal) entityEditModal.hide();
    setStatus(`Registro ${entityId} atualizado com sucesso em ${resourceKey}.`, "success");
    await refreshReferenceData(["escritorios", "advogados", "clientes"]);
    await fetchGet(
      listRouteByResource[resourceKey],
      `Lista de ${resourceLabelByKey[resourceKey] || resourceKey}`,
      navButtonByResource[resourceKey]
    );
  } catch (error) {
    setStatus(`Falha ao atualizar ${resourceKey} ${entityId}: ${error.message}`, "danger");
  } finally {
    if (btnSaveEntityEdit) btnSaveEntityEdit.disabled = false;
  }
}

function getEditActionFromEvent(event) {
  const editActionButton = event.target.closest(".btn-row-edit-entity");
  if (!editActionButton) return null;
  return {
    resourceKey: editActionButton.dataset.resource,
    entityId: editActionButton.dataset.id,
  };
}

function getDeleteActionFromEvent(event) {
  const deleteActionButton = event.target.closest(".btn-row-delete");
  if (!deleteActionButton) return null;
  return {
    resourceKey: deleteActionButton.dataset.resource,
    entityId: deleteActionButton.dataset.id,
    deleteActionButton,
  };
}

async function runEditAction(resourceKey, entityId) {
  if (!resourceKey || !entityId) {
    setStatus("Nao foi possivel identificar o item para edicao.", "danger");
    return;
  }

  if (resourceKey === "processos") {
    await openProcessEditModal(entityId);
    return;
  }

  await openEntityEditModal(resourceKey, entityId);
}

async function executeDeleteRequest(resourceKey, entityId) {
  const apiResponse = await fetchWithFallback(`/${resourceKey}/${encodeURIComponent(entityId)}`, {
    method: "DELETE",
  });
  const responsePayload = await parseResponseJson(apiResponse);
  if (!apiResponse.ok) {
    const message = responsePayload?.error || `Erro HTTP ${apiResponse.status}`;
    throw new Error(message);
  }
}

async function runDeleteAction(deleteAction) {
  const { resourceKey, entityId, deleteActionButton } = deleteAction;
  if (!resourceKey || !entityId) {
    setStatus("Nao foi possivel identificar o item para exclusao.", "danger");
    return;
  }

  const resourceLabel = resourceLabelByKey[resourceKey] || resourceKey;
  const confirmedDeletion = await askDeleteConfirmation(resourceLabel, entityId);
  if (!confirmedDeletion) return;

  try {
    deleteActionButton.disabled = true;
    setStatus(`Excluindo item ${entityId} de ${resourceLabel}...`);
    await executeDeleteRequest(resourceKey, entityId);
    setStatus(`Item ${entityId} excluido com sucesso em ${resourceLabel}.`, "success");
    await refreshReferenceData(["escritorios", "advogados", "clientes"]);
    await fetchGet(
      listRouteByResource[resourceKey],
      `Lista de ${resourceLabel}`,
      navButtonByResource[resourceKey]
    );
  } catch (error) {
    setStatus(`Falha ao excluir item ${entityId}: ${error.message}`, "danger");
  } finally {
    deleteActionButton.disabled = false;
  }
}

async function handleTableActionClick(event) {
  // Event delegation: um único listener no <tbody> captura clique nos botões de ação.
  const editAction = getEditActionFromEvent(event);
  if (editAction) {
    await runEditAction(editAction.resourceKey, editAction.entityId);
    return;
  }

  const deleteAction = getDeleteActionFromEvent(event);
  if (!deleteAction) return;
  await runDeleteAction(deleteAction);
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

function runSafeAsyncTask(taskRunner, fallbackMessage = "Falha inesperada na interface.") {
  Promise.resolve()
    .then(taskRunner)
    .catch((error) => {
      console.error(error);
      const errorMessage = `${fallbackMessage} ${error?.message || ""}`.trim();
      setStatus(errorMessage, "danger");
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
  btnSaveProcessEdit.addEventListener("click", () => {
    runSafeAsyncTask(submitProcessEdit, "Falha ao salvar processo.");
  });
}

if (formProcessEdit) {
  formProcessEdit.addEventListener("submit", (event) => {
    event.preventDefault();
    runSafeAsyncTask(submitProcessEdit, "Falha ao salvar processo.");
  });
}

if (processEditModalEl) {
  processEditModalEl.addEventListener("hidden.bs.modal", () => {
    if (formProcessEdit) formProcessEdit.reset();
    processEditId.value = "";
    processRowBeingEdited = null;
  });
}

if (btnSaveEntityEdit) {
  btnSaveEntityEdit.addEventListener("click", () => {
    runSafeAsyncTask(submitEntityEdit, "Falha ao salvar alteracoes.");
  });
}

if (formEntityEdit) {
  formEntityEdit.addEventListener("submit", (event) => {
    event.preventDefault();
    runSafeAsyncTask(submitEntityEdit, "Falha ao salvar alteracoes.");
  });
}

if (entityEditModalEl) {
  entityEditModalEl.addEventListener("hidden.bs.modal", () => {
    if (formEntityEdit) formEntityEdit.reset();
    entityEditResource.value = "";
    entityEditId.value = "";
    toggleEntityEditSections("");
  });
}

document.getElementById("btnDashboard").addEventListener("click", () => {
  runSafeAsyncTask(loadDashboard, "Falha ao carregar dashboard.");
});

document.getElementById("btnAdvogados").addEventListener("click", () => {
  runSafeAsyncTask(
    () => fetchGet("/advogados", "Lista de Advogados", "btnAdvogados"),
    "Falha ao carregar advogados."
  );
});

document.getElementById("btnClientes").addEventListener("click", () => {
  runSafeAsyncTask(
    () => fetchGet("/clientes", "Lista de Clientes", "btnClientes"),
    "Falha ao carregar clientes."
  );
});

document.getElementById("btnEscritorios").addEventListener("click", () => {
  runSafeAsyncTask(
    () => fetchGet("/escritorios", "Lista de Escritorios", "btnEscritorios"),
    "Falha ao carregar escritorios."
  );
});

document.getElementById("btnProcessos").addEventListener("click", () => {
  runSafeAsyncTask(
    () => fetchGet("/processos", "Lista de Processos", "btnProcessos"),
    "Falha ao carregar processos."
  );
});

formAdvogadoNome.addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = event.target.nome.value.trim();
  if (!nome) return;
  activateNav("btnAdvogados");
  runSafeAsyncTask(
    () => fetchGet(`/advogados/nome/${encodeURIComponent(nome)}`, `Advogado por nome: ${nome}`),
    "Falha ao buscar advogado."
  );
});

formClienteNome.addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = event.target.nome.value.trim();
  if (!nome) return;
  activateNav("btnClientes");
  runSafeAsyncTask(
    () => fetchGet(`/clientes/nome/${encodeURIComponent(nome)}`, `Cliente por nome: ${nome}`),
    "Falha ao buscar cliente."
  );
});

formEscritorioEmail.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = event.target.email.value.trim();
  if (!email) return;
  activateNav("btnEscritorios");
  runSafeAsyncTask(
    () =>
      fetchGet(`/escritorios/email/${encodeURIComponent(email)}`, `Escritorio por email: ${email}`),
    "Falha ao buscar escritorio por email."
  );
});

formEscritorioTelefone.addEventListener("submit", (event) => {
  event.preventDefault();
  const telefone = event.target.telefone.value.trim();
  if (!telefone) return;
  activateNav("btnEscritorios");
  runSafeAsyncTask(
    () =>
      fetchGet(
        `/escritorios/telefone/${encodeURIComponent(telefone)}`,
        `Escritorio por telefone: ${telefone}`
      ),
    "Falha ao buscar escritorio por telefone."
  );
});

tableFilter.addEventListener("input", refreshFilteredTable);
btnClearFilter.addEventListener("click", () => {
  tableFilter.value = "";
  refreshFilteredTable();
});

if (dashboardStatusCharts) {
  dashboardStatusCharts.addEventListener("click", (event) => {
    const statusCardButton = event.target.closest(".status-chart-button");
    if (!statusCardButton) return;
    const status = statusCardButton.dataset.status;
    if (!status) return;
    runSafeAsyncTask(
      () => openProcessListByStatus(status),
      "Falha ao abrir filtro de status."
    );
  });
}

if (btnDashboardStatusClear) {
  btnDashboardStatusClear.addEventListener("click", () => {
    runSafeAsyncTask(openAllProcessesFromDashboard, "Falha ao abrir todos os processos.");
  });
}

formWriteOperation.addEventListener("submit", (event) => {
  runSafeAsyncTask(() => submitWriteOperation(event), "Falha ao executar operacao.");
});
tableBody.addEventListener("click", (event) => {
  runSafeAsyncTask(() => handleTableActionClick(event), "Falha na acao da tabela.");
});
runSafeAsyncTask(
  () => refreshReferenceData(["escritorios", "advogados", "clientes"]),
  "Falha ao carregar dados de referencia."
);
runSafeAsyncTask(loadDashboard, "Falha ao iniciar dashboard.");
