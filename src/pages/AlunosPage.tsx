import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlunosLista } from "../components/alunos/AlunosLista";
import { Button, buttonStyles } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";
import { StatCard } from "../components/ui/StatCard";
import { EmptyState, ErrorState } from "../components/ui/States";
import { useAlunos } from "../hooks/useAlunos";
import { mensagemDeErro } from "../lib/api";
import { resumirAlunos } from "../lib/alunos";
import type { StatusAluno } from "../lib/alunos";
import { formatarNumero, normalizarTexto } from "../lib/format";

type Filtro = "todos" | StatusAluno;

export function AlunosPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useAlunos();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const resumo = useMemo(() => resumirAlunos(data ?? []), [data]);

  const visiveis = useMemo(() => {
    const termo = normalizarTexto(busca);
    return (data ?? []).filter((aluno) => {
      const combinaStatus = filtro === "todos" || aluno.status === filtro;
      const combinaBusca =
        termo === "" || normalizarTexto(aluno.nome).includes(termo) || normalizarTexto(aluno.email).includes(termo);
      return combinaStatus && combinaBusca;
    });
  }, [data, busca, filtro]);

  function limparFiltros() {
    setBusca("");
    setFiltro("todos");
  }

  const acoes = (
    <Link to="/alunos/novo" className={buttonStyles("primary")}>
      Novo aluno
    </Link>
  );

  return (
    <>
      <PageHeader
        eyebrow="Alunos"
        title="Alunos cadastrados"
        description="Notas, nota final e status de cada aluno, direto da API."
        actions={acoes}
      />

      {isPending ? (
        <div role="status" aria-live="polite">
          <span className="sr-only">Carregando alunos…</span>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="mt-8 grid gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title="Não deu para carregar os alunos"
          message={mensagemDeErro(error)}
          onRetry={() => void refetch()}
          retrying={isFetching}
        />
      ) : data.length === 0 ? (
        <EmptyState
          title="Nenhum aluno cadastrado ainda"
          text="Cadastre o primeiro aluno para ver a lista, a média da turma e os resultados aqui."
          action={
            <Link to="/alunos/novo" className={buttonStyles("primary")}>
              Cadastrar primeiro aluno
            </Link>
          }
        />
      ) : (
        <>
          <section aria-label="Resumo da turma" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard rotulo="Alunos" valor={formatarNumero(resumo.total)} detalhe="cadastrados" />
            <StatCard rotulo="Aprovados" valor={formatarNumero(resumo.aprovados)} tom="ok" detalhe="nota final 7 ou mais" />
            <StatCard rotulo="Reprovados" valor={formatarNumero(resumo.reprovados)} tom="bad" detalhe="nota final abaixo de 7" />
            <StatCard rotulo="Média final" valor={formatarNumero(resumo.mediaFinal, 1)} detalhe="soma das duas notas" />
          </section>

          <section aria-label="Alunos" className="mt-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="w-full sm:max-w-xs">
                <label htmlFor="busca" className="sr-only">
                  Buscar por nome ou e-mail
                </label>
                <input
                  id="busca"
                  type="search"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por nome ou e-mail"
                  className="w-full rounded-lg border border-line bg-panel px-3.5 py-2.5 text-sm placeholder:text-muted/70 hover:border-muted focus:border-brand"
                />
              </div>

              <div role="group" aria-label="Filtrar por status" className="flex gap-1 rounded-xl border border-line bg-panel p-1">
                {(
                  [
                    ["todos", "Todos"],
                    ["Aprovado", "Aprovados"],
                    ["Reprovado", "Reprovados"],
                  ] as [Filtro, string][]
                ).map(([valor, texto]) => (
                  <button
                    key={valor}
                    type="button"
                    aria-pressed={filtro === valor}
                    onClick={() => setFiltro(valor)}
                    className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                      filtro === valor ? "bg-brand text-ink" : "text-muted hover:text-text"
                    }`}
                  >
                    {texto}
                  </button>
                ))}
              </div>
            </div>

            <p className="mb-3 text-sm text-muted" aria-live="polite">
              Mostrando {formatarNumero(visiveis.length)} de {formatarNumero(resumo.total)}{" "}
              {resumo.total === 1 ? "aluno" : "alunos"}
            </p>

            {visiveis.length === 0 ? (
              <EmptyState
                title="Nenhum aluno encontrado"
                text="Nenhum aluno combina com a busca ou com o filtro escolhido."
                action={
                  <Button variant="secondary" onClick={limparFiltros}>
                    Limpar filtros
                  </Button>
                }
              />
            ) : (
              <AlunosLista alunos={visiveis} />
            )}
          </section>
        </>
      )}
    </>
  );
}
