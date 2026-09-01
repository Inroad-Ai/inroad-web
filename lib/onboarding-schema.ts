import { z } from "zod";

/** Runs a schema and reduces the result to the shape every step screen wants:
 * null when the value is fine, the first problem's message otherwise. */
function validate(schema: z.ZodType<string>, value: string): string | null {
  const result = schema.safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? "Invalid value");
}

// first_name / last_name: ProfileUpsert requires 1-200 characters.
export const nameSchema = z
  .string()
  .trim()
  .min(1, "Required")
  .max(200, "Must be under 200 characters");

export function validateName(value: string): string | null {
  return validate(nameSchema, value);
}

export const emailSchema = z
  .email("Enter a valid email address")
  .max(255, "Must be under 255 characters");

export function validateEmail(value: string): string | null {
  return validate(emailSchema, value);
}

// Digit-count and character-set rule shared across every screen that asks
// for a phone number, rather than each one doing its own ad hoc check.
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Required")
  .max(50, "Must be under 50 characters")
  .regex(/^[0-9+()\-.\s]+$/, "Enter a valid phone number")
  .refine((value) => {
    const digits = value.replace(/[^0-9]/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }, "Enter a valid phone number");

export function validatePhone(value: string): string | null {
  return validate(phoneSchema, value);
}

// location is optional in ProfileUpsert, so an empty field is not an error -
// the wrapper below short-circuits before the schema ever sees it.
export const locationSchema = z.string().trim().max(200, "Must be under 200 characters");

export function validateLocation(value: string): string | null {
  if (value.trim() === "") return null;
  return validate(locationSchema, value);
}

// linkedin_url / github_url / portfolio_url share this: all optional, all
// capped at 500 characters in ProfileUpsert.
export const urlSchema = z.url("Enter a valid URL").max(500, "Must be under 500 characters");

export function validateUrl(value: string): string | null {
  if (value.trim() === "") return null;
  return validate(urlSchema, value);
}
