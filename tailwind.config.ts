import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: withOpacity("--color-ink"),
        "ink-muted": withOpacity("--color-ink-muted"),
        "ink-faint": withOpacity("--color-ink-faint"),
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
        "on-amber": withOpacity("--color-on-amber"),
        chalk: withOpacity("--color-chalk"),
        "monogram-1": withOpacity("--color-monogram-1"),
        "monogram-2": withOpacity("--color-monogram-2"),
        "monogram-3": withOpacity("--color-monogram-3"),
        "monogram-4": withOpacity("--color-monogram-4"),
        "monogram-5": withOpacity("--color-monogram-5"),
        "monogram-6": withOpacity("--color-monogram-6"),
        "hero-shade": withOpacity("--color-hero-shade"),
        scrim: withOpacity("--color-scrim"),
        line: withOpacity("--color-line"),
        // Semantic aliases — same values as above, named by role.
        error: withOpacity("--color-error"),
        "error-subtle": withOpacity("--color-error-subtle"),
      },
      fontFamily: {
        // Set by next/font in app/layout.tsx, consumed as CSS variables.
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "2xs": ["var(--text-2xs-size)", { lineHeight: "var(--text-2xs-line-height)" }],
        eyebrow: ["var(--text-eyebrow-size)", { lineHeight: "var(--text-eyebrow-line-height)" }],
        xs: ["var(--text-xs-size)", { lineHeight: "var(--text-xs-line-height)" }],
        sm: ["var(--text-sm-size)", { lineHeight: "var(--text-sm-line-height)" }],
        base: ["var(--text-base-size)", { lineHeight: "var(--text-base-line-height)" }],
        lg: ["var(--text-lg-size)", { lineHeight: "var(--text-lg-line-height)" }],
        xl: ["var(--text-xl-size)", { lineHeight: "var(--text-xl-line-height)" }],
        "2xl": ["var(--text-2xl-size)", { lineHeight: "var(--text-2xl-line-height)" }],
        "3xl": ["var(--text-3xl-size)", { lineHeight: "var(--text-3xl-line-height)" }],
        "4xl": ["var(--text-4xl-size)", { lineHeight: "var(--text-4xl-line-height)" }],
        title: ["var(--text-title-size)", { lineHeight: "var(--text-title-line-height)" }],
        section: ["var(--text-section-size)", { lineHeight: "var(--text-section-line-height)" }],
        chapter: ["var(--text-chapter-size)", { lineHeight: "var(--text-chapter-line-height)" }],
        "chapter-xl": [
          "var(--text-chapter-xl-size)",
          { lineHeight: "var(--text-chapter-xl-line-height)" },
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
        nest: "var(--radius-nest)",
        card: "var(--radius-card)",
        full: "var(--radius-full)",
      },
      spacing: {
        page: "var(--space-page)",
      },
      height: {
        chart: "var(--size-chart)",
        console: "var(--size-console)",
        wall: "var(--size-wall)",
        "story-track": "var(--size-story-track)",
      },
      width: {
        bleed: "var(--size-bleed)",
      },
      maxWidth: {
        bubble: "var(--size-bubble)",
        drawer: "var(--size-drawer)",
        popover: "var(--size-popover)",
      },
      gridTemplateColumns: {
        "main-aside": "var(--grid-main-aside)",
        footer: "var(--grid-footer)",
        console: "var(--grid-console)",
        story: "var(--grid-story)",
        "label-value": "var(--grid-label-value)",
        "label-value-wide": "var(--grid-label-value-wide)",
        sources: "var(--grid-sources)",
        "sources-wide": "var(--grid-sources-wide)",
        meter: "var(--grid-meter)",
        checklist: "var(--grid-checklist)",
      },
      gridTemplateRows: {
        story: "var(--grid-story-rows)",
      },
      backgroundColor: {
        lane: "var(--surface-lane)",
        panel: "var(--surface-panel)",
        "panel-chip": "var(--surface-panel-chip)",
      },
      transitionProperty: {
        width: "width",
        visibility: "visibility",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        pop: "var(--shadow-pop)",
        nest: "var(--shadow-nest)",
        amber: "var(--shadow-amber)",
        "amber-hover": "var(--shadow-amber-hover)",
      },
      backgroundImage: {
        "glow-amber": "radial-gradient(closest-side, var(--glow-amber), transparent 70%)",
        "glow-teal": "radial-gradient(closest-side, var(--glow-teal), transparent 70%)",
        "glow-ember": "radial-gradient(closest-side, var(--glow-ember), transparent 70%)",
      },
      letterSpacing: {
        display: "var(--tracking-display)",
        heading: "var(--tracking-heading)",
        utility: "var(--tracking-utility)",
      },
      lineHeight: {
        display: "var(--leading-display)",
      },
      transitionDuration: {
        fast: "var(--motion-duration-fast)",
        base: "var(--motion-duration-base)",
        slow: "var(--motion-duration-slow)",
      },
      transitionTimingFunction: {
        emphasized: "var(--motion-ease-emphasized)",
        standard: "var(--motion-ease-standard)",
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
        // Modal, Menu and Drawer panels arriving.
        "pop-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          "100%": { opacity: "1", transform: "none" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        // Eyebrow's live dot: an amber ring that breathes out and fades.
        "ring-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 4px rgb(var(--color-signal-amber) / 0.14)" },
          "50%": { boxShadow: "0 0 0 7px rgb(var(--color-signal-amber) / 0)" },
        },
        shimmer: {
          "0%": { opacity: "1" },
          "50%": { opacity: "0.55" },
          "100%": { opacity: "1" },
        },
        // FileUpload's uploading/parsing bar - no real percentage to show
        // (see FileUpload.tsx), so a sweeping segment stands in for one.
        indeterminate: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        "fade-up": "fade-up 0.35s ease-out both",
        "pop-in": "pop-in var(--motion-duration-fast) var(--motion-ease-emphasized) both",
        "slide-in-left":
          "slide-in-left var(--motion-duration-base) var(--motion-ease-emphasized) both",
        "ring-pulse": "ring-pulse 1.6s ease-in-out infinite",
        shimmer: "shimmer 1.6s ease-in-out infinite",
        indeterminate: "indeterminate 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [
    // Phones held landscape or with a short browser chrome: the pinned story drops its copy.
    plugin(({ addVariant }) => addVariant("short", "@media (max-height: 760px)")),
  ],
};

export default config;
