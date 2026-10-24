import {
  DARK_MEDIA_QUERY,
  DEFAULT_THEME_PREFERENCE,
  THEME_ATTRIBUTE,
  THEME_PREFERENCES,
  THEME_STORAGE_KEY,
} from "./theme.constants";

// Runs before first paint so the stored theme is in place before anything
// renders. It repeats the resolve logic from resolve-theme.ts because it has
// to be plain text; the constants are shared so the keys cannot drift. If
// storage throws, nothing is set and tokens.css falls back to night.
export const THEME_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(${JSON.stringify(THEME_PREFERENCES)}.indexOf(p)<0)p=${JSON.stringify(
  DEFAULT_THEME_PREFERENCE,
)};var d=p==="dark"||(p==="system"&&matchMedia(${JSON.stringify(
  DARK_MEDIA_QUERY,
)}).matches);document.documentElement.setAttribute(${JSON.stringify(
  THEME_ATTRIBUTE,
)},d?"dark":"light")}catch(e){}})();`;
