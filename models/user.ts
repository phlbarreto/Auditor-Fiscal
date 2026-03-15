import { query } from "~/infra/database";
import { NotFoundError } from "~/infra/errors";
import type { NewUser, RegisteredUser } from "~/interface/user";

const create = async (userObjectValue: NewUser) => {
  try {
    const newUser = await runInsertQuery(userObjectValue);
    return newUser;

    async function runInsertQuery(userObjectValue: NewUser) {
      const { email, name, hashedPassword } = userObjectValue;
      const result = await query(
        `INSERT INTO
            users (name, email, password)
        VALUES 
            ($1, $2, $3)
        RETURNING id, name, email;`,
        [name, email, hashedPassword],
      );
      return result.rows[0];
    }
  } catch (error) {
    console.error("Erro ao criar usuário: ", error);
    throw error;
  }
};

const findOneByEmail = async (email: string): Promise<RegisteredUser> => {
  const user = await runSelectQuery(email);
  return user;

  async function runSelectQuery(email: string) {
    const result = await query(
      `SELECT 
          *
        FROM 
          users 
        WHERE 
          email = $1
        LIMIT
          1;`,
      [email],
    );

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O email informado não foi encontrado no sistema.",
        action: "Verifique se o email foi digitado corretamente.",
      });
    }

    return result.rows[0];
  }
};

const findOneById = async (id: string) => {
  const userFound = await runSelectQuery(id);
  return userFound;

  async function runSelectQuery(id: string) {
    const results = await query(
      `SELECT
        *
      FROM
        users
      WHERE
        id = $1
      LIMIT
        1;`,
      [id],
    );

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O id informado não foi encontrado no sistema.",
        action: "Verifique se o id está difitado corretamente.",
      });
    }

    return results.rows[0];
  }
};

const user = {
  create,
  findOneByEmail,
  findOneById,
};

export default user;
