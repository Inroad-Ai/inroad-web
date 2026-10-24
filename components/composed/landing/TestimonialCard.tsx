import type { Testimonial } from "@/lib/testimonials";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="m-0 flex flex-col gap-4 rounded-card bg-surface p-5 shadow-card">
      <blockquote className="text-base text-ink-muted">{testimonial.quote}</blockquote>
      <figcaption className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/10 bg-ink/5 text-xs font-sans-semibold text-ink-muted"
        >
          {initials(testimonial.name)}
        </span>
        <span className="min-w-0 flex-1">
          <b className="block text-sm font-sans-semibold text-ink">{testimonial.name}</b>
          {testimonial.context ? (
            <span className="block text-xs text-ink-muted">{testimonial.context}</span>
          ) : null}
        </span>
        <span className="utility-label shrink-0 text-right text-ink-faint">
          Landed
          <b className="block font-sans text-xs font-sans-semibold normal-case tracking-normal text-signal-teal">
            {testimonial.role}
          </b>
        </span>
      </figcaption>
    </figure>
  );
}
