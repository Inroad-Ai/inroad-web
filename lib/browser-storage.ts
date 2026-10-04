// localStorage throws in private windows and when site data is blocked, and
// a lost preference is never worth a crashed page.
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Same reasoning as readStorage: the preference just won't persist.
  }
}
