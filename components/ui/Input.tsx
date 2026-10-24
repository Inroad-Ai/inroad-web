import type { InputHTMLAttributes } from "react";

import { CONTROL_CLASSES } from "./control-styles";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${CONTROL_CLASSES} ${className}`} {...props} />;
}
