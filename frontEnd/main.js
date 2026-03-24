// Configuracao inicial e referencias de elementos da interface.
const API_BASE = "http://localhost:3000";
const tableTitle = document.getElementById("tableTitle");
const statusText = document.getElementById("statusText");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const jsonOutput = document.getElementById("jsonOutput");

// Atualiza status visual da tela.
function setStatus(message) {
  statusText.textContent = message;
}

// Garante formato de array para renderizacao da tabela.
function normalizeRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") return [payload];
  return [];
}

// Renderiza titulo, JSON bruto e tabela dinamica conforme a resposta da API.
function renderTable(title, payload) {
  const rows = normalizeRows(payload);
  tableTitle.textContent = title;
  jsonOutput.textContent = JSON.stringify(payload, null, 2);

  if (rows.length === 0) {
    tableHead.innerHTML = "";
    tableBody.innerHTML = `
      <tr>
        <td class="text-center py-4">Nenhum registro encontrado.</td>
      </tr>
    `;
    return;
  }

  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  tableHead.innerHTML = `<tr>${columns.map((col) => `<th>${col}</th>`).join("")}</tr>`;
  tableBody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        ${columns
          .map((col) => {
            const value = row[col];
            return `<td>${value == null ? "-" : String(value)}</td>`;
          })
          .join("")}
      </tr>
    `
    )
    .join("");
}

// Funcao unica para executar GET, tratar erro e atualizar a interface.
async function fetchGet(endpoint, title) {
  try {
    setStatus(`Consultando ${endpoint}...`);
    const response = await fetch(`${API_BASE}${endpoint}`);
    const data = await response.json();

    if (!response.ok) {
      const message = data?.error || `Erro HTTP ${response.status}`;
      throw new Error(message);
    }

    renderTable(title, data);
    setStatus(`Consulta concluida: ${endpoint}`);
  } catch (error) {
    renderTable(title, []);
    jsonOutput.textContent = JSON.stringify({ error: error.message }, null, 2);
    setStatus(`Falha: ${error.message}`);
  }
}

// Eventos de botoes para listagens gerais.
document.getElementById("btnAdvogados").addEventListener("click", () => {
  fetchGet("/advogados", "Lista de Advogados");
});

document.getElementById("btnClientes").addEventListener("click", () => {
  fetchGet("/clientes", "Lista de Clientes");
});

document.getElementById("btnEscritorios").addEventListener("click", () => {
  fetchGet("/escritorios", "Lista de Escritorios");
});

document.getElementById("btnProcessos").addEventListener("click", () => {
  fetchGet("/processos", "Lista de Processos");
});

// Eventos de formularios para buscas especificas.
document.getElementById("formAdvogadoNome").addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = event.target.nome.value.trim();
  if (!nome) return;
  fetchGet(`/advogados/nome/${encodeURIComponent(nome)}`, `Advogado por nome: ${nome}`);
});

document.getElementById("formClienteNome").addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = event.target.nome.value.trim();
  if (!nome) return;
  fetchGet(`/clientes/nome/${encodeURIComponent(nome)}`, `Cliente por nome: ${nome}`);
});

document.getElementById("formEscritorioEmail").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = event.target.email.value.trim();
  if (!email) return;
  fetchGet(
    `/escritorios/email/${encodeURIComponent(email)}`,
    `Escritorio por email: ${email}`
  );
});

document.getElementById("formEscritorioTelefone").addEventListener("submit", (event) => {
  event.preventDefault();
  const telefone = event.target.telefone.value.trim();
  if (!telefone) return;
  fetchGet(
    `/escritorios/telefone/${encodeURIComponent(telefone)}`,
    `Escritorio por telefone: ${telefone}`
  );
});
