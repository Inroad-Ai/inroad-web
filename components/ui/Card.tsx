import type { HTMLAttributes, ReactNode } from "react";

type Variant = "default" | "nested" | "interactive";
type Padding = "none" | "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  default: "rounded-card bg-surface shadow-card",
  nested: "rounded-nest bg-surface-raised",
  interactive:
    "rounded-card bg-surface shadow-card transition duration-fast ease-standard hover:-translate-y-0.5 hover:shadow-card-hover focus-within:shadow-card-hover",
};

const PADDINGS: Record<Padding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "article" | "li";
  /** `nested` sits inside another card; `interactive` lifts on hover for a card that opens something. */
  variant?: Variant;
  padding?: Padding;
  children: ReactNode;
}

/** The soft-elevated surface: a solid fill and layered shadow, never a border. */
export function Card({
  as: Tag = "div",
  variant = "default",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <Tag className={`${VARIANTS[variant]} ${PADDINGS[padding]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
