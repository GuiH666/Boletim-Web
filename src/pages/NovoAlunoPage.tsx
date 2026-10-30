import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Button, buttonStyles } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useCriarAluno } from "../hooks/useAlunos";
import { mensagemDeErro } from "../lib/api";
import { NOTA_APROVACAO, NOTA_MAX, NOTA_MIN, calcularResultado, lerNota, validarAluno } from "../lib/alunos";
import type { CampoFormulario, ValoresFormulario } from "../lib/alunos";
import { formatarNumero } from "../lib/format";

const VAZIO: ValoresFormulario = { nome: "", email: "", nota1: "", nota2: "" };
const ORDEM_DOS_CAMPOS: CampoFormulario[] = ["nome", "email", "nota1", "nota2"];

export function NovoAlunoPage() {
  const [valores, setValores] = useState<ValoresFormulario>(VAZIO);
  const [tocados, setTocados] = useState<Partial<Record<CampoFormulario, boolean>>>({});
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const criar = useCriarAluno();

  const { erros } = validarAluno(valores);

  /** O erro de um campo só aparece depois que a pessoa saiu dele ou tentou enviar. */
  function erroVisivel(campo: CampoFormulario): string | undefined {
    return tocados[campo] || tentouEnviar ? erros[campo] : undefined;
  }

  function alterar(campo: CampoFormulario, valor: string) {
    setValores((atual) => ({ ...atual, [campo]: valor }));
    if (criar.isError) criar.reset();
  }

  function sair(campo: CampoFormulario) {
    setTocados((atual) => ({ ...atual, [campo]: true }));
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setTentouEnviar(true);

    const { erros: errosAgora, aluno } = validarAluno(valores);
    if (!aluno) {
      const primeiro = ORDEM_DOS_CAMPOS.find((campo) => errosAgora[campo]);
      if (primeiro) document.getElementById(primeiro)?.focus();
      return;
    }

    criar.mutate(aluno);
  }

  function cadastrarOutro() {
    setValores(VAZIO);
    setTocados({});
    setTentouEnviar(false);
    criar.reset();
  }

  /* ---------- Sucesso ---------- */
  if (criar.isSuccess) {
    const criado = criar.data;
    return (
      <>
        <PageHeader eyebrow="Novo aluno" title="Aluno cadastrado" />
        <div role="status" className="max-w-xl rounded-3xl border border-ok/40 bg-ok-soft/40 p-6 sm:p-8">
          <p className="text-sm font-bold tracking-[0.12em] text-ok uppercase">Cadastro concluído</p>
          <h2 className="mt-2 text-2xl break-words">{criado.nome}</h2>
          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-ink p-3">
              <dt className="text-xs text-muted">Código</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums">{criado.id}</dd>
            </div>
            <div className="rounded-xl bg-ink p-3">
              <dt className="text-xs text-muted">Nota final</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums">{formatarNumero(criado.notaFinal)}</dd>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-ink p-3">
              <dt className="mb-1 text-xs text-muted">Status</dt>
              <dd>
                <StatusBadge status={criado.status} />
              </dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/alunos" className={buttonStyles("primary")}>
              Ver lista de alunos
            </Link>
            <Button variant="secondary" onClick={cadastrarOutro}>
              Cadastrar outro aluno
            </Button>
          </div>
        </div>
      </>
    );
  }

  /* ---------- Formulário ---------- */
  const nota1 = lerNota(valores.nota1, "nota 1");
  const nota2 = lerNota(valores.nota2, "nota 2");
  const previa = "valor" in nota1 && "valor" in nota2 ? calcularResultado(nota1.valor, nota2.valor) : null;

  return (
    <>
      <PageHeader
        eyebrow="Novo aluno"
        title="Cadastrar aluno"
        description="Informe os dados e as duas notas. A nota final e o status são calculados pela API."
      />

      <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={enviar} noValidate className="grid gap-5 rounded-3xl border border-line bg-panel p-6 sm:p-8">
          <Field
            id="nome"
            label="Nome completo"
            autoComplete="off"
            placeholder="Ex.: Maria Silva"
            value={valores.nome}
            onChange={(e) => alterar("nome", e.target.value)}
            onBlur={() => sair("nome")}
            error={erroVisivel("nome")}
          />
          <Field
            id="email"
            label="E-mail"
            type="email"
            autoComplete="off"
            placeholder="Ex.: maria@exemplo.com"
            value={valores.email}
            onChange={(e) => alterar("email", e.target.value)}
            onBlur={() => sair("email")}
            error={erroVisivel("email")}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="nota1"
              label="Nota 1"
              inputMode="numeric"
              autoComplete="off"
              placeholder={`${NOTA_MIN} a ${NOTA_MAX}`}
              value={valores.nota1}
              onChange={(e) => alterar("nota1", e.target.value)}
              onBlur={() => sair("nota1")}
              error={erroVisivel("nota1")}
              hint="Número inteiro de 0 a 10."
            />
            <Field
              id="nota2"
              label="Nota 2"
              inputMode="numeric"
              autoComplete="off"
              placeholder={`${NOTA_MIN} a ${NOTA_MAX}`}
              value={valores.nota2}
              onChange={(e) => alterar("nota2", e.target.value)}
              onBlur={() => sair("nota2")}
              error={erroVisivel("nota2")}
              hint="Número inteiro de 0 a 10."
            />
          </div>

          {criar.isError ? (
            <div role="alert" className="rounded-xl border border-bad/40 bg-bad-soft/60 p-4 text-sm">
              <p className="font-semibold text-bad">Não foi possível cadastrar</p>
              <p className="mt-1 text-text/90">{mensagemDeErro(criar.error)}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={criar.isPending}>
              {criar.isPending ? "Cadastrando…" : "Cadastrar aluno"}
            </Button>
            <Link to="/alunos" className={buttonStyles("ghost")}>
              Cancelar
            </Link>
          </div>
        </form>

        <aside aria-label="Prévia do resultado" className="rounded-3xl border border-line bg-panel p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">Prévia do resultado</p>
          {previa ? (
            <div aria-live="polite">
              <p className="mt-4 text-5xl font-bold text-brand tabular-nums">{formatarNumero(previa.notaFinal)}</p>
              <p className="mt-1 text-sm text-muted">nota final</p>
              <div className="mt-5">
                <StatusBadge status={previa.status} />
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted" aria-live="polite">
              Preencha as duas notas para ver a nota final e o status.
            </p>
          )}
          <p className="mt-6 border-t border-line pt-4 text-xs text-muted">
            Regra: nota final = nota 1 + nota 2. Aprovado com {NOTA_APROVACAO} ou mais. Quem confirma o resultado é a API
            ao cadastrar.
          </p>
        </aside>
      </div>
    </>
  );
}
