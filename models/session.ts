import crypto from "node:crypto";
import { query } from "~/infra/database.js";
import { UnauthorizedError } from "~/infra/errors";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000; // 30 Days

async function findOneValidByToken(sessionToken: string) {
  const sessionFound = await runSelectQuery(sessionToken);

  return sessionFound;

  async function runSelectQuery(sessionToken: string) {
    const results = await query(
      `
        SELECT
          *
        FROM
          sessions
        WHERE
          token = $1
          AND expires_at > NOW()
        LIMIT
          1
      `,
      [sessionToken],
    );

    if (results.rowCount === 0) {
      throw new UnauthorizedError({
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
      });
    }

    return results.rows[0];
  }
}

async function create(userId: string) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newSession = await runInsertQuery(token, userId, expiresAt);
  return newSession;

  async function runInsertQuery(
    token: string,
    userId: string,
    expiresAt: Date,
  ) {
    const results = await query(
      `
        INSERT INTO
          sessions (token, user_id, expires_at)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      `,
      [token, userId, expiresAt],
    );

    return results.rows[0];
  }
}

async function renew(sessionId: string) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
  const renewedSession = await runUpdateQuery(sessionId, expiresAt);
  return renewedSession;

  async function runUpdateQuery(sessionId: string, expiresAt: Date) {
    const results = await query(
      `
        UPDATE
          sessions
        SET
          expires_at = $2,
          updated_at = NOW()
        WHERE
          id = $1
        RETURNING
          *
        ;`,
      [sessionId, expiresAt],
    );

    return results.rows[0];
  }
}

async function expireById(sessionId: string) {
  const expiredSessionObject = await runUpdateQuery(sessionId);
  return expiredSessionObject;

  async function runUpdateQuery(sessionId: string) {
    const results = await query(
      `
        UPDATE
          sessions
        SET
          expires_at = expires_at - interval '1 year',
          updated_at = NOW()
        WHERE
          id = $1
        RETURNING
          *
      `,
      [sessionId],
    );

    return results.rows[0];
  }
}

const session = {
  create,
  findOneValidByToken,
  renew,
  expireById,
  EXPIRATION_IN_MILLISECONDS,
};

export default session;
