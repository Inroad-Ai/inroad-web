/** The API's PASSWORD_MIN_LENGTH; every password form checks against this. */
export const MIN_PASSWORD_LENGTH = 8;

/** Why a new password can't be saved yet, or null when it can. */
export function newPasswordProblem(password: string, confirmation: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password needs to be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return password === confirmation ? null : "Those passwords don't match.";
}
