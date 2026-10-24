"use client";

import { Button } from "@/components/ui/Button";
import { googleSignInUrl } from "@/lib/api-client/client";

/** Monochrome G. The four-colour mark would be the only art in the app not built from tokens. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="fill-current">
      <path d="M12 10.2v3.9h5.45a4.67 4.67 0 0 1-2.03 3.06l3.28 2.54c1.91-1.77 3.01-4.37 3.01-7.46 0-.72-.06-1.41-.19-2.08zM12 22c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12l-3.34 2.58C4.72 19.78 8.09 22 12 22M6.41 13.91a6 6 0 0 1 0-3.82L3.07 7.51a10 10 0 0 0 0 8.98zM12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2 8.09 2 4.72 4.22 3.07 7.51l3.34 2.58C7.2 7.73 9.4 5.98 12 5.98" />
    </svg>
  );
}

/** Continue with Google, then the "or with email" divider that leads into the form. */
export function GoogleSignIn() {
  return (
    <div className="grid gap-5">
      <Button
        type="button"
        variant="quiet"
        size="lg"
        icon={<GoogleIcon />}
        onClick={() => {
          window.location.href = googleSignInUrl();
        }}
        className="w-full"
      >
        Continue with Google
      </Button>
      <div className="flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        <span className="utility-label text-ink-faint">or with email</span>
        <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}
