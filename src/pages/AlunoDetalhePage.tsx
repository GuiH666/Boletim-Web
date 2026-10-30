import { Link } from "@tanstack/react-router";
import { buttonStyles } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { StatusBadge } from "../components/ui/StatusBadge";
import { EmptyState, ErrorState } from "../components/ui/States";
import { useAluno } from "../hooks/useAlunos";
import { erroNaoEncontrado, mensagemDeErro } from "../lib/api";
import { NOTA_APROVACAO } from "../lib/alunos";
import { formatarNumero } from "../lib/format";

function Voltar() {
  return (
    <Link to="/alunos" className="mb-6 inline-flex text-sm font-semibold text-muted hover:text-text">
      ← Voltar para a lista
    </Link>
  );
}

export function AlunoDetalhePage({ id }: { id: string }) {
  const { data: aluno, isPending, isError, error, refetch, isFetching } = useAluno(id);

  if (isPending) {
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">Carregando aluno…</span>
        <Skeleton className="mb-6 h-5 w-40" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  if (isError) {
    if (erroNaoEncontrado(error)) {
      return (
        <>
          <Voltar />
          <EmptyState
            title="Aluno não encontrado"
            text={`Não existe aluno com o código ${id}. Ele pode ter sido removido ou o endereço está errado.`}
            action={
              <Link to="/alunos" className={buttonStyles("primary")}>
                Ver todos os alunos
              </Link>
            }
          />
        </>
      );
    }

    return (
      <>
        <Voltar />
        <ErrorState
          title="Não deu para carregar o aluno"
          message={mensagemDeErro(error)}
          onRetry={() => void refetch()}
          retrying={isFetching}
        />
      </>
    );
  }

  return (
    <>
      <Voltar />
      <article className="rounded-3xl border border-line bg-panel p-6 sm:p-10">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-extrabold tracking-[0.14em] text-brand uppercase">Aluno nº {aluno.id}</p>
            <h1 className="mt-2 text-3xl break-words sm:text-4xl">{aluno.nome}</h1>
            <p className="mt-2 break-all text-muted">{aluno.email}</p>
          </div>
          <StatusBadge status={aluno.status} />
        </header>

        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-ink p-5">
            <dt className="text-xs font-bold tracking-[0.12em] text-muted uppercase">Nota 1</dt>
            <dd className="mt-2 text-4xl font-bold tabular-nums">{formatarNumero(aluno.nota1)}</dd>
          </div>
          <div className="rounded-2xl bg-ink p-5">
            <dt className="text-xs font-bold tracking-[0.12em] text-muted uppercase">Nota 2</dt>
            <dd className="mt-2 text-4xl font-bold tabular-nums">{formatarNumero(aluno.nota2)}</dd>
          </div>
          <div className="rounded-2xl bg-brand-soft p-5">
            <dt className="text-xs font-bold tracking-[0.12em] text-brand uppercase">Nota final</dt>
            <dd className="mt-2 text-4xl font-bold text-brand tabular-nums">{formatarNumero(aluno.notaFinal)}</dd>
          </div>
        </dl>

        <p className="mt-8 text-sm text-muted">
          A nota final é a soma das duas notas. O aluno é aprovado com {NOTA_APROVACAO} ou mais.
        </p>
      </article>
    </>
  );
}
