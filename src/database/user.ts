import { User } from "@prisma/client";

import { error, info } from "@/utils/logger";
import { prisma } from ".";

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
 * Retrieves a user from the database by their Telegram ID.
 * @param id Telegram ID of the user to find.
 * @returns The user if found, `null` otherwise.
 */
export const getUserByTelegramId = (
  id?: User["telegramId"],
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      telegramId: id,
    },
  });
};

/**
 * Checks if a user exists in the database.
 * @param telegramId Telegram ID of the user to check.
 * @returns `true` if the user exists, `false` otherwise.
 */
export const userExists = async (
  telegramId?: User["telegramId"],
): Promise<boolean> => {
  if (!telegramId) return false;

  const user = await prisma.user.findUnique({
    where: {
      telegramId,
    },
  });

  return user !== null;
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

/**
 * Checks if a user should record data today. Compares the last recorded date with today's date.
 * @param telegramId User's Telegram ID.
 * @returns `true` if the user should record data today, `false` otherwise.
 */
export const shouldRecordToday = async (telegramId: User["telegramId"]) => {
  const user = await prisma.user.findUnique({
    where: {
      telegramId,
    },
    include: {
      data: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  // The user does not exist yet
  if (!user) return false;
  // The user doesn't have any data recorded yet
  else if (user.data.length === 0) return true;

  const d2s = (date: Date) => date.toISOString().split("T")[0];

  const today = d2s(new Date());
  const lastRecorded = d2s(new Date(user.data[0]!.createdAt));

  return today !== lastRecorded;
};
