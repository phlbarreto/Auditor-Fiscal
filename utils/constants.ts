export const apiBase = "/api/v1";
const apiFDBUrl = "http://localhost:2610";
export const ROUTES = {
  api: {
    createUser: `${apiBase}/users`,
    login: `${apiBase}/login`,
    logout: `${apiBase}/logout`,
    fetchUser: `${apiBase}/user`,
    produtos: `${apiBase}/produtos`,
    apiFDBStatus: `${apiBase}/fdb/status`,
  },
  url: {
    users: "/users",
    login: "/login",
    logout: "/logout",
    user: "/user",
    produtos: "/produtos",
    apiFDBStatus: "/fdb/status",
  },
  app: {
    icms: "/corrigir-icms",
    ncm: "/corrigir-ncm",
    xml: "/importar-xml",
    atualizarProdutos: "/produtos/atualizar",
    cadastrarProdutos: "/produtos/cadastrar",
  },
  apiFDB: {
    status: `${apiFDBUrl}/status`,
    atualizarProdutos: `${apiFDBUrl}/produtos`,
  },
};

export const protectedRoutes = [
  "/corrigir-icms",
  "/corrigir-ncm",
  "/importar-xml",
];
