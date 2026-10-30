type Tom = "neutro" | "ok" | "bad";

const cores: Record<Tom, string> = {
  neutro: "text-text",
  ok: "text-ok",
  bad: "text-bad",
};

interface StatCardProps {
  rotulo: string;
  valor: string;
  detalhe?: string;
  tom?: Tom;
}

/** Cartão de indicador: rótulo pequeno em cima, número grande embaixo (mesmo padrão do site da academia). */
export function StatCard({ rotulo, valor, detalhe, tom = "neutro" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">{rotulo}</p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${cores[tom]}`}>{valor}</p>
      {detalhe ? <p className="mt-1 text-xs text-muted">{detalhe}</p> : null}
    </div>
  );
}
