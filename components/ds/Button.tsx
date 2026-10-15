import type { ButtonHTMLAttributes } from "react";
import { cx, Icon, type IconName } from "./Icon";

/** Pílula de ação. `capsula` é o botão de duas metades, um por tela, só para gerar. */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "capsula";
  icon?: IconName;
}

export function Button({ variant = "secondary", icon, className, children, type = "button", ...rest }: ButtonProps) {
  const cls = cx("cp-btn", `cp-btn-${variant}`, className);

  if (variant === "capsula") {
    return (
      <button type={type} className={cls} {...rest}>
        <span className="cp-btn-cap-l">{children}</span>
        <span className="cp-btn-cap-r">
          <Icon name={icon ?? "arrow"} size={18} />
        </span>
      </button>
    );
  }

  return (
    <button type={type} className={cls} {...rest}>
      {icon ? <Icon name={icon} size={18} /> : null}
      <span>{children}</span>
    </button>
  );
}
