import type { Config } from "tailwindcss";

/**
 * Every colour in the app is declared here and nowhere else. Components
 * reference token names (`bg-surface`, `text-signal-amber`); no component
 * carries a hardcoded hex value.
 *
 * Every value below is a CSS custom property (`var(--color-*)`, `var(--font-*)`),
 * never a hardcoded hex/px value - that's the wiring the design tokens prompt
 * needs already in place. Those custom properties are declared in
 * app/globals.css today; styles/tokens.css (imported by globals.css) is where
 * that declaration moves once the design tokens prompt populates it. Nothing
 * here has to change when that happens.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        "ink-muted": "var(--color-ink-muted)",
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        paper: "var(--color-paper)",
        "signal-amber": "var(--color-signal-amber)",
        "signal-amber-hover": "var(--color-signal-amber-hover)",
        "signal-amber-subtle": "var(--color-signal-amber-subtle)",
        "signal-teal": "var(--color-signal-teal)",
        "signal-teal-hover": "var(--color-signal-teal-hover)",
        "signal-teal-subtle": "var(--color-signal-teal-subtle)",
        "muted-rose": "var(--color-muted-rose)",
        "muted-rose-subtle": "var(--color-muted-rose-subtle)",
        success: "var(--color-success)",
        "success-subtle": "var(--color-success-subtle)",
        warning: "var(--color-warning)",
        "warning-subtle": "var(--color-warning-subtle)",
        line: "var(--color-line)",
        // Semantic aliases — same values as above, named by role.
        bg: "var(--color-bg)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        border: "var(--color-border)",
        "accent-primary": "var(--color-accent-primary)",
        "accent-secondary": "var(--color-accent-secondary)",
        error: "var(--color-error)",
        "error-subtle": "var(--color-error-subtle)",
      },
      fontFamily: {
        // Set by next/font in app/layout.tsx, consumed as CSS variables.
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui"],
      },
      fontSize: {
        xs: ["var(--text-xs-size)", { lineHeight: "var(--text-xs-line-height)" }],
        sm: ["var(--text-sm-size)", { lineHeight: "var(--text-sm-line-height)" }],
        base: ["var(--text-base-size)", { lineHeight: "var(--text-base-line-height)" }],
        lg: ["var(--text-lg-size)", { lineHeight: "var(--text-lg-line-height)" }],
        xl: ["var(--text-xl-size)", { lineHeight: "var(--text-xl-line-height)" }],
        "2xl": ["var(--text-2xl-size)", { lineHeight: "var(--text-2xl-line-height)" }],
        "3xl": ["var(--text-3xl-size)", { lineHeight: "var(--text-3xl-line-height)" }],
        "4xl": ["var(--text-4xl-size)", { lineHeight: "var(--text-4xl-line-height)" }],
        wordmark: [
          "var(--text-wordmark-size)",
          { lineHeight: "var(--text-wordmark-line-height)" },
        ],
      },
      fontWeight: {
        "sans-regular": "var(--font-weight-sans-regular)",
        "sans-medium": "var(--font-weight-sans-medium)",
        "sans-semibold": "var(--font-weight-sans-semibold)",
        "sans-bold": "var(--font-weight-sans-bold)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        overlay: "var(--shadow-overlay)",
        card: "var(--shadow-card)",
      },
      letterSpacing: {
        utility: "0.08em",
      },
      keyframes: {
        // StatusDot, "still checking" state.
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.82)" },
        },
        // ConvergenceAnimation: three lines drawing inward.
        converge: {
          "0%": { strokeDashoffset: "var(--line-length)" },
          "100%": { strokeDashoffset: "0" },
        },
        // The amber outline that resolves around a returned result.
        "resolve-outline": {
          "0%": { strokeDashoffset: "var(--outline-length)", opacity: "0.2" },
          "100%": { strokeDashoffset: "0", opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        converge: "converge 1.6s ease-in-out infinite",
        "resolve-outline": "resolve-outline 0.7s ease-out forwards",
        "fade-up": "fade-up 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
