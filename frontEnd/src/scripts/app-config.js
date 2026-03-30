export const CONFIG = {
  API_PORT: 3000,
  API_LOCAL_HOSTS: ["localhost", "127.0.0.1"],
  DASHBOARD_STATUS_SKELETON_COUNT: 4,
  CHART_BORDER_WIDTH: 1,
  CHART_BORDER_RADIUS: 8,
  CHART_STEP_SIZE: 1,
  DASHBOARD_TOTAL_BACKGROUND_COLORS: ["#2563eb", "#f97316", "#10b981", "#a855f7"],
  DASHBOARD_TOTAL_BORDER_COLORS: ["#1d4ed8", "#c2410c", "#047857", "#7e22ce"],
  CHART_FALLBACK_COLOR: "#8b5cf6",
  CHART_OTHER_SLICE_COLOR: "#e5e7eb",
  CHART_BORDER_COLOR: "#ffffff",
  STATUS_ORDER: ["Aberto", "Em andamento", "Concluido", "Arquivado", "Sem status"],
  STATUS_LABEL_BY_API: {
    aberto: "Aberto",
    andamento: "Em andamento",
    "em andamento": "Em andamento",
    encerrado: "Concluido",
    concluido: "Concluido",
    arquivado: "Arquivado",
  },
  STATUS_API_BY_LABEL: {
    Aberto: "aberto",
    "Em andamento": "andamento",
    Concluido: "encerrado",
    Arquivado: "arquivado",
  },
  STATUS_COLOR_BY_LABEL: {
    Aberto: "#3b82f6",
    "Em andamento": "#f59e0b",
    Concluido: "#10b981",
    Arquivado: "#6b7280",
    "Sem status": "#94a3b8",
  },
};

export const createRouteByResource = {
  advogados: "/criar-advogado",
  clientes: "/criar-cliente",
  escritorios: "/criar-escritorio",
  processos: "/criar-processo",
};

export const listRouteByResource = {
  advogados: "/advogados",
  clientes: "/clientes",
  escritorios: "/escritorios",
  processos: "/processos",
};

export const navButtonByResource = {
  advogados: "btnAdvogados",
  clientes: "btnClientes",
  escritorios: "btnEscritorios",
  processos: "btnProcessos",
};

export const resourceByNavButton = {
  btnDashboard: "dashboard",
  btnAdvogados: "advogados",
  btnClientes: "clientes",
  btnEscritorios: "escritorios",
  btnProcessos: "processos",
};

export const resourceLabelByKey = {
  dashboard: "Dashboard",
  advogados: "Advogados",
  clientes: "Clientes",
  escritorios: "Escritorios",
  processos: "Processos",
};

export const actionToHttpMethod = {
  criar: "POST",
  atualizar: "PUT",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  post: "POST",
  put: "PUT",
  delete: "DELETE",
};

export const actionLabelByHttpMethod = {
  POST: "Criar",
  PUT: "Atualizar",
  DELETE: "Apagar",
};

export function buildApiBaseCandidates() {
  const configuredBase = window.localStorage.getItem("API_BASE_URL");
  const defaultBases = CONFIG.API_LOCAL_HOSTS.map(
    (host) => `http://${host}:${CONFIG.API_PORT}`
  );

  if (window.location.protocol !== "file:") {
    defaultBases.unshift(
      `${window.location.protocol}//${window.location.hostname}:${CONFIG.API_PORT}`
    );
  }

  return [...new Set([configuredBase, ...defaultBases].filter(Boolean))];
}
