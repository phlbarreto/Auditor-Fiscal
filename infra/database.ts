import pg from "pg";
const { Pool } = pg;
const postgresClient = () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  return {
    client,
  };
};

const { client } = postgresClient();

export const query = async (sql: string, paramns: any[]) => {
  try {
    const result = await client.query(sql, paramns);
    return result;
  } catch (error) {
    console.log("Erro na query: ", error);
    throw error;
  }
};
