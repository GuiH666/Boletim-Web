import type { ReactNode } from "react";
import { Button } from "./Button";

/*
 * Os três estados que toda tela com dados de servidor precisa tratar além do "deu certo":
 * carregando (Skeleton, em cada página), erro (ErrorState) e vazio (EmptyState).
 */

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
}

export function ErrorState({ title = "Não deu para carregar", message, onRetry, retrying = false }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-2xl border border-bad/40 bg-bad-soft/60 p-6 sm:p-8">
      <h2 className="text-lg text-bad">{title}</h2>
      <p className="mt-2 max-w-prose text-sm text-text/90">{message}</p>
      {onRetry ? (
        <Button variant="secondary" className="mt-5" onClick={onRetry} disabled={retrying}>
          {retrying ? "Tentando de novo…" : "Tentar de novo"}
        </Button>
      ) : null}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  text: string;
  action?: ReactNode;
}

export function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-panel/60 p-8 text-center sm:p-12">
      <h2 className="text-lg">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{text}</p>
      {action ? <div className="mt-5 flex justify-center gap-3">{action}</div> : null}
    </div>
  );
}
