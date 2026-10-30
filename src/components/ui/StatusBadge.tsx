import type { StatusAluno } from "../../lib/alunos";

const estilos: Record<StatusAluno, string> = {
  Aprovado: "bg-ok-soft text-ok",
  Reprovado: "bg-bad-soft text-bad",
};

/** O símbolo ao lado do texto garante que o status não dependa só da cor. */
const simbolos: Record<StatusAluno, string> = {
  Aprovado: "✓",
  Reprovado: "✕",
};

export function StatusBadge({ status }: { status: StatusAluno }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${estilos[status] ?? "bg-line text-muted"}`}
    >
      <span aria-hidden="true">{simbolos[status] ?? "•"}</span>
      {status}
    </span>
  );
}
