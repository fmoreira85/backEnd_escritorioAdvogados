function buildApiBaseCandidates() {
  const configured = window.localStorage.getItem("API_BASE_URL");
  const defaults = ["http://localhost:3000", "http://127.0.0.1:3000"];

  if (window.location.protocol !== "file:") {
    defaults.unshift(`${window.location.protocol}//${window.location.hostname}:3000`);
  }

  return [...new Set([configured, ...defaults].filter(Boolean))];
}

const API_BASE_CANDIDATES = buildApiBaseCandidates();
let activeApiBase = API_BASE_CANDIDATES[0];
let lastRenderedRows = [];
let lastRenderedColumns = [];

const tableTitle = document.getElementById("tableTitle");
const statusText = document.getElementById("statusText");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const tableFilter = document.getElementById("tableFilter");
const btnClearFilter = document.getElementById("btnClearFilter");
const kpiRows = document.getElementById("kpiRows");
const kpiModulo = document.getElementById("kpiModulo");
const navButtons = [...document.querySelectorAll(".nav-item")];
const formWriteOperation = document.getElementById("formWriteOperation");
const writeResource = document.getElementById("writeResource");
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

const actionToHttpMethod = {
  criar: "POST",
  atualizar: "PUT",
  apagar: "DELETE",
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
  statusText.textContent = message;
  statusText.classList.remove("status-danger", "status-success");

  if (tone === "danger") statusText.classList.add("status-danger");
  if (tone === "success") statusText.classList.add("status-success");
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
  if (rows.length === 0) {
    tableHead.innerHTML = columns.length
      ? `<tr>${columns.map((col) => `<th>${escapeHtml(col)}</th>`).join("")}</tr>`
      : "";

    const span = Math.max(columns.length, 1);
    tableBody.innerHTML = `<tr><td class="empty-row" colspan="${span}">Nenhum registro encontrado.</td></tr>`;
    return;
  }

  tableHead.innerHTML = `<tr>${columns.map((col) => `<th>${escapeHtml(col)}</th>`).join("")}</tr>`;
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
  const rows = normalizeRows(payload);
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];

  tableTitle.textContent = title;

  lastRenderedRows = rows;
  lastRenderedColumns = columns;
  refreshFilteredTable();
}

function activateNav(buttonId) {
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.id === buttonId);
  });

  const activeName = document.getElementById(buttonId)?.textContent?.trim() || "-";
  kpiModulo.textContent = activeName;
}

function toNumberOrNull(value) {
  const text = String(value ?? "").trim();
  return text ? Number(text) : null;
}

function toggleSimpleForms() {
  const resource = writeResource.value;
  simpleAdvogados.hidden = resource !== "advogados";
  simpleClientes.hidden = resource !== "clientes";
  simpleEscritorios.hidden = resource !== "escritorios";
  simpleProcessos.hidden = resource !== "processos";
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

async function submitWriteOperation(event) {
  event.preventDefault();

  const resource = writeResource.value;
  const action = writeMethod.value;
  const method = actionToHttpMethod[action];
  const id = writeId.value.trim();

  if (!method) {
    setStatus("Acao invalida. Recarregue a pagina e tente novamente.", "danger");
    return;
  }

  let endpoint = "";
  let payload = null;

  if (method === "POST") {
    endpoint = createRouteByResource[resource];
  } else {
    if (!id) {
      setStatus("Informe o ID para as acoes Atualizar e Apagar.", "danger");
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

document.getElementById("formAdvogadoNome").addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = event.target.nome.value.trim();
  if (!nome) return;
  activateNav("btnAdvogados");
  fetchGet(`/advogados/nome/${encodeURIComponent(nome)}`, `Advogado por nome: ${nome}`);
});

document.getElementById("formClienteNome").addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = event.target.nome.value.trim();
  if (!nome) return;
  activateNav("btnClientes");
  fetchGet(`/clientes/nome/${encodeURIComponent(nome)}`, `Cliente por nome: ${nome}`);
});

document.getElementById("formEscritorioEmail").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = event.target.email.value.trim();
  if (!email) return;
  activateNav("btnEscritorios");
  fetchGet(`/escritorios/email/${encodeURIComponent(email)}`, `Escritorio por email: ${email}`);
});

document.getElementById("formEscritorioTelefone").addEventListener("submit", (event) => {
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
writeResource.addEventListener("change", toggleSimpleForms);
toggleSimpleForms();
