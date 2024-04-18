import { FormWizardContext as Context } from "@/types/bot";

type ValidMessage = NonNullable<Context["message"]> & {
  text: string;
};

/**
 * Does the `message` object contains a valid input?
 */
export const hasInput = {
  message: "Couldn't understand your input",
  fn: (message: Context["message"]): message is ValidMessage =>
    !!message && "text" in message,
};

/**
 * Does the number value is within the specified range?
 * @param range A tuple with the minimum and maximum values allowed.
 */
export const isInRange = ([min = 0, max = Infinity]: [number, number?]) => ({
  validate: (value: number) => !isNaN(value) && value >= min && value <= max,
  message:
    `Please enter a valid number greater than ${min}` +
    (max === Infinity ? "." : ` and less than ${max}.`),
});
