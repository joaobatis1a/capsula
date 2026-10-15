import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cx, Icon } from "./Icon";

interface FieldBase {
  label: string;
  hint?: string;
  error?: string;
  id?: string;
  className?: string;
}

type InputField = FieldBase & { as?: "input" } & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">;
type TextareaField = FieldBase & { as: "textarea" } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">;
type SelectField = FieldBase & { as: "select" } & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "className">;

/** Campo com rótulo, dica e erro. `as` troca o controle por textarea ou select. */
export type FieldProps = InputField | TextareaField | SelectField;

export function Field(props: FieldProps) {
  const { label, hint, error, id: idProp, className, as = "input", ...rest } = props;
  const id = idProp ?? "cp-f-" + label.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-");
  const hintId = `${id}-hint`;
  const a11y = {
    id,
    className: "cp-input",
    "aria-describedby": hint || error ? hintId : undefined,
    "aria-invalid": error ? true : undefined,
  };

  let control;
  if (as === "textarea") control = <textarea rows={3} {...a11y} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />;
  else if (as === "select") control = <select {...a11y} {...(rest as SelectHTMLAttributes<HTMLSelectElement>)} />;
  else control = <input {...a11y} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />;

  return (
    <div className={cx("cp-field", error && "is-error", className)}>
      <label className="cp-label" htmlFor={id}>
        {label}
      </label>
      {control}
      {error ? (
        <p className="cp-hint cp-hint-error" id={hintId}>
          <Icon name="x" size={14} />
          {error}
        </p>
      ) : hint ? (
        <p className="cp-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
