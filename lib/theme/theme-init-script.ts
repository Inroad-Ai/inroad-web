import { DARK_MEDIA_QUERY, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from "./theme.constants";

// Runs before first paint so a dark-mode user never sees a light flash. It
// repeats the resolve logic from resolve-theme.ts because it has to be plain
// text; the constants are shared so the keys cannot drift.
export const THEME_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var d=p==="dark"||(p!=="light"&&matchMedia(${JSON.stringify(
  DARK_MEDIA_QUERY,
)}).matches);if(d)document.documentElement.setAttribute(${JSON.stringify(
  THEME_ATTRIBUTE,
)},"dark")}catch(e){}})();`;
