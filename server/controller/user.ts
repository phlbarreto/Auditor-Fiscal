import { H3Event } from "h3";
import {
  InternalServerError,
  UnauthorizedError,
  ValidationError,
} from "~/infra/errors";
import authentication from "~/models/authentication";
import { hashPass } from "~/models/password";
import session from "~/models/session";
import user from "~/models/user";

export const create = async (event: H3Event) => {
  try {
    const body = await readBody(event);
    const { name, email, password } = body;

    const invalidParams = !name || !email || !password;

    if (!body || invalidParams) {
      throw new ValidationError({
        message: "Corpo da requisição é obrigatório",
        action: "Verifique os dados enviados e tente novamente",
      });
    }

    const hashedPassword = await hashPass(password);

    await user.create({ name, email, hashedPassword });
    return "Usuário cadastrado com sucesso";
  } catch (error) {
    throw new InternalServerError({
      cause: error,
    });
  }
};

export const login = async (event: H3Event) => {
  try {
    const providedData = await readBody(event);
    const { email, password } = providedData;

    const invalidParams = !email || !password;

    if (!providedData || invalidParams) {
      throw new ValidationError({
        message: "Corpo da requisição é obrigatório",
        action: "Verifique os dados enviados e tente novamente",
      });
    }
    const authenticatedUser =
      await authentication.getAuthenticatedUser(providedData);
    const newSession = await session.create(authenticatedUser.id);
    setSessionCookie(newSession.token, event);
    return "Usuário autenticado com sucesso!";
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados não conferem",
        action: "Verifique se o email e senha estão corretos",
      });
    }
    throw new InternalServerError({
      cause: error,
    });
  }
};

const setSessionCookie = (sessionToken: string, event: H3Event) => {
  setCookie(event, "session_id", sessionToken, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 2, // 2 dias
  });
};

const clearSessionCookie = (event: H3Event) => {
  deleteCookie(event, "session_id");
};

export const logout = async (event: H3Event) => {
  try {
    const sessionId = getCookie(event, "session_id");
    const sessionObject = await session.findOneValidByToken(
      sessionId as string,
    );

    await session.expireById(sessionObject.id);
    clearSessionCookie(event);
    return "Até logo!";
  } catch (error) {
    throw new InternalServerError({
      cause: error,
    });
  }
};

export const fetchUser = async (event: H3Event) => {
  try {
    const sessionId = getCookie(event, "session_id");
    const sessionObject = await session.findOneValidByToken(
      sessionId as string,
    );

    const userObject = await user.findOneById(sessionObject.user_id);
    const userData = {
      id: userObject.id,
      name: userObject.name,
      email: userObject.email,
    };
    return userData;
  } catch (error) {
    console.log("Usuário não autenticado!");
  }
};
