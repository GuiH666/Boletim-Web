import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

/** Cabeçalho padrão das páginas: rótulo pequeno, título, texto de apoio e ações. */
export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-extrabold tracking-[0.14em] text-brand uppercase">{eyebrow}</p>
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
