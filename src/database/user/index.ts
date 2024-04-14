import { User } from "@prisma/client";
import { error, info } from "@/utils/logger";
import { prisma } from "..";

// TODO: analyze if catching the error is the best approach or we should
// rethrow the error to the caller

/**
 * Creates a new user in the database.
 * @param user User's data to be stored.
 * @returns The created user or `null` if an error ocurred.
 */
export const createUser = async (
  user: Pick<User, "username" | "telegramId">,
) => {
  try {
    const result = await prisma.user.create({
      data: user,
    });

    info(`User (${user.telegramId}) created.`);
    return result;
  } catch (e) {
    error("An error ocurred while creating the user:", e);
    return null;
  }
};

/**
 * Retrieves all users that have the `notify` flag set to `true`.
 * @returns A list of users.
 */
export const getAllNotifiableUsers = () => {
  return prisma.user.findMany({
    where: {
      notify: true,
    },
  });
};

/**
 * Toggles the `notify` flag for a given user.
 * @param telegramId Telegram ID of the user to toggle the notify flag.
 * @returns `true` if the operation was successful, `false` otherwise.
 */
export const toggleNotify = async (
  telegramId: User["telegramId"],
): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      telegramId,
    },
  });

  if (!user) return false;

  try {
    await prisma.user.update({
      where: { telegramId },
      data: { notify: !user.notify },
    });

    return true;
  } catch {
    return false;
  }
};
