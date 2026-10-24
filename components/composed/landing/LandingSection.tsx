import type { ReactNode } from "react";

/** The page-width column every landing section after the story sits in. */
export function LandingSection({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`relative py-20 md:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">{children}</div>
    </section>
  );
}
