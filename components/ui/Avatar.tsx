import { MONOGRAM_FACE, MONOGRAM_SIZES, monogramFill, type MonogramSize } from "./monogram";

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

/** A person's initials on their monogram colour. Decorative: the name always
 * sits next to it in text. */
export function Avatar({ name, size = "md" }: { name: string; size?: MonogramSize }) {
  return (
    <span
      aria-hidden
      className={`${MONOGRAM_FACE} rounded-full ${monogramFill(name)} ${MONOGRAM_SIZES[size]}`}
    >
      <span className="relative">{initialsOf(name) || "?"}</span>
    </span>
  );
}
