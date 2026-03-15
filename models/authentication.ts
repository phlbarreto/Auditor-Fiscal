import user from "./user";
import type { AuthenticatedUser, RegisteredUser } from "~/interface/user";
import { NotFoundError, UnauthorizedError } from "~/infra/errors";
import { comparePassword } from "./password";

const getAuthenticatedUser = async (
  providedUser: RegisteredUser,
): Promise<AuthenticatedUser> => {
  try {
    const storedUser = await findOneByEmail(providedUser.email);
    await validatePassword(providedUser.password, storedUser.password);
    return storedUser;
  } catch (error) {
    console.error("Erro fazer login: ", error);
    throw error;
  }

  async function findOneByEmail(providedEmail: string) {
    let storedUser;
    try {
      storedUser = await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Email não confere.",
          action: "Verifique se este dado está correto.",
        });
      }
      throw error;
    }

    return storedUser;
  }
};

const validatePassword = async (
  providedPassword: string,
  storedPassword: string,
) => {
  const correctPasswordMatch = await comparePassword(
    providedPassword,
    storedPassword,
  );

  if (!correctPasswordMatch) {
    throw new UnauthorizedError({
      message: "Senha não confere.",
      action: "Verifique se este dado está correto.",
    });
  }
};

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
