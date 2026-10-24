import type { TextareaHTMLAttributes } from "react";

import { CONTROL_CLASSES } from "./control-styles";

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${CONTROL_CLASSES} min-h-28 resize-y ${className}`} {...props} />;
}
