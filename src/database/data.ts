import { Data, User } from "@prisma/client";
import { prisma } from ".";

type CreateRecordValues = Partial<
  Pick<
    Data,
    | "mood"
    | "weight"
    | "coffeeCount"
    | "didCry"
    | "didExercise"
    | "didMeditate"
    | "note"
  >
>;

// TODO: add error handling
/**
 * Records data for a given user.
 * @param telegramId Telegram user ID to record the data for.
 * @param values Data to be recorded.
 * @returns The recorded data.
 */
export const recordData = (
  telegramId: User["telegramId"],
  values: CreateRecordValues,
) => {
  // TODO: add defaults in case some of the values are missing.
  // For example, if weight is missing, it should reuse the last recorded weight.
  // If mood or note are missing, they should be set to null.
  return prisma.data.create({
    data: {
      ...values,
      user: {
        connect: {
          telegramId,
        },
      },
    },
  });
};
