export function loadEnv() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("URL de conexão com o banco de dados indefinida!");
  }

  console.log('Env carregado com sucesso!');
  
  return {
    DATABASE_URL,
  };
}
