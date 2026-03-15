import { genSalt, hash, compare } from "bcrypt";
export const hashPass = async (password: string): Promise<string> => {
  try {
    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

export const comparePassword = async (
  providedPassword: string,
  storedPassword: string,
): Promise<boolean> => {
  try {
    return await compare(providedPassword, storedPassword);
  } catch (error) {
    throw error;
  }
};
