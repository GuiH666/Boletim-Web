import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

function Logo() {
  return (
    <svg viewBox="0 0 64 64" className="size-8" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#7c9cff" />
      <path
        d="M24 48V16h10a8 8 0 0 1 0 16H24m10 0a8 8 0 0 1 0 16H24"
        fill="none"
        stroke="#0e1120"
        strokeWidth="7"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

const linkBase = "rounded-lg px-3 py-2 text-sm font-semibold transition-colors";
const linkIdle = { className: "text-muted hover:text-text" };
const linkActive = { className: "bg-brand-soft text-brand" };

/** Moldura de todas as páginas: cabeçalho com navegação, conteúdo e rodapé. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-ink/90">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-4">
          <Link to="/" className="flex items-center gap-3" aria-label="Boletim, página inicial">
            <Logo />
            <span className="text-lg font-bold tracking-tight">Boletim</span>
          </Link>

          <nav aria-label="Principal" className="flex items-center gap-1">
            <Link to="/" className={linkBase} activeOptions={{ exact: true }} activeProps={linkActive} inactiveProps={linkIdle}>
              Início
            </Link>
            <Link to="/alunos" className={linkBase} activeOptions={{ exact: true }} activeProps={linkActive} inactiveProps={linkIdle}>
              Alunos
            </Link>
            <Link to="/alunos/novo" className={linkBase} activeOptions={{ exact: true }} activeProps={linkActive} inactiveProps={linkIdle}>
              Novo aluno
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:py-14">{children}</main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-muted">
          <p>Boletim · projeto de portfólio de Guilherme Bomfim Ribeiro</p>
          <a className="underline-offset-4 hover:text-text hover:underline" href="https://github.com/GuiH666" target="_blank" rel="noreferrer">
            github.com/GuiH666
          </a>
        </div>
      </footer>
    </div>
  );
}
