import type { Config } from "tailwindcss";

/**
 * Maps token names components use (`bg-surface`) onto the custom properties
 * in styles/tokens.css. Colors resolve through rgb(var(--*) / <alpha-value>)
 * so Tailwind's opacity modifiers (`border-paper/15`) work; tokens.css
 * stores each color as an "R G B" channel triplet, not a hex string.
 */
function withOpacity(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: withOpacity("--color-ink"),
        "ink-muted": withOpacity("--color-ink-muted"),
        surface: withOpacity("--color-surface"),
        "surface-raised": withOpacity("--color-surface-raised"),
        paper: withOpacity("--color-paper"),
        "signal-amber": withOpacity("--color-signal-amber"),
        "signal-amber-hover": withOpacity("--color-signal-amber-hover"),
        "signal-amber-subtle": withOpacity("--color-signal-amber-subtle"),
        "signal-teal": withOpacity("--color-signal-teal"),
        "signal-teal-hover": withOpacity("--color-signal-teal-hover"),
        "signal-teal-subtle": withOpacity("--color-signal-teal-subtle"),
        "muted-rose": withOpacity("--color-muted-rose"),
        "muted-rose-subtle": withOpacity("--color-muted-rose-subtle"),
        success: withOpacity("--color-success"),
        "success-subtle": withOpacity("--color-success-subtle"),
        warning: withOpacity("--color-warning"),
        "warning-subtle": withOpacity("--color-warning-subtle"),
        line: withOpacity("--color-line"),
        // Semantic aliases — same values as above, named by role.
        bg: withOpacity("--color-bg"),
        "text-primary": withOpacity("--color-text-primary"),
        "text-secondary": withOpacity("--color-text-secondary"),
        border: withOpacity("--color-border"),
        "accent-primary": withOpacity("--color-accent-primary"),
        "accent-secondary": withOpacity("--color-accent-secondary"),
        error: withOpacity("--color-error"),
        "error-subtle": withOpacity("--color-error-subtle"),
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
        hero: ["var(--text-hero-size)", { lineHeight: "var(--text-hero-line-height)" }],
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
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        "fade-up": "fade-up 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
