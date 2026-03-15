const apiBase = "/api/v1";
export const ROUTES = {
  api: {
    createUser: `${apiBase}/users`,
    login: `${apiBase}/login`,
    logout: `${apiBase}/logout`,
    fetchUser: `${apiBase}/user`,
  },
  app: {
    icms: "/corrigir-icms",
    ncm: "/corrigir-ncm",
    xml: "/importar-xml",
  },
};

export const protectedRoutes = [
  "/corrigir-icms",
  "/corrigir-ncm",
  "/importar-xml",
];
