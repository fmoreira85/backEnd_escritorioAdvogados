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

async function fetchWithFallback(endpoint) {
  let lastError = null;

  for (const base of API_BASE_CANDIDATES) {
    try {
      const response = await fetch(`${base}${endpoint}`);
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
