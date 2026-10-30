import { Link } from "@tanstack/react-router";
import { buttonStyles } from "../components/ui/Button";
import { StatusBadge } from "../components/ui/StatusBadge";
import { NOTA_APROVACAO } from "../lib/alunos";

const acessos = [
  {
    numero: "01",
    titulo: "Lista de alunos",
    texto: "Consulte todos os alunos, busque por nome ou e-mail e filtre por aprovados e reprovados.",
    to: "/alunos",
  },
  {
    numero: "02",
    titulo: "Cadastro com validação",
    texto: "O formulário confere os dados antes de enviar e mostra a prévia da nota final e do status.",
    to: "/alunos/novo",
  },
  {
    numero: "03",
    titulo: "Detalhe do aluno",
    texto: "Abra um aluno para ver as duas notas, a nota final calculada e o resultado.",
    to: "/alunos",
  },
] as const;

export function HomePage() {
  return (
    <div className="grid gap-16">
      <section className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
        <div>
          <p className="mb-3 text-xs font-extrabold tracking-[0.14em] text-brand uppercase">Gestão escolar</p>
          <h1 className="max-w-[18ch] text-4xl text-balance sm:text-5xl">Notas, alunos e resultados em um só lugar</h1>
          <p className="mt-5 max-w-[48ch] text-lg text-muted">
            Cadastre os alunos, informe as duas notas e o Boletim mostra a nota final e se o aluno foi aprovado,
            tudo vindo da API REST de gerenciamento de alunos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/alunos" className={buttonStyles("primary")}>
              Ver alunos
            </Link>
            <Link to="/alunos/novo" className={buttonStyles("secondary")}>
              Cadastrar aluno
            </Link>
          </div>
        </div>

        <aside aria-label="Exemplo de boletim" className="rounded-3xl border border-line bg-panel p-6 shadow-2xl shadow-black/30 sm:p-8">
          <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">Exemplo</p>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-bold">Aluno Exemplo</p>
              <p className="text-sm text-muted">aluno@exemplo.com</p>
            </div>
            <StatusBadge status="Aprovado" />
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-ink p-3">
              <dt className="text-xs text-muted">Nota 1</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">6</dd>
            </div>
            <div className="rounded-xl bg-ink p-3">
              <dt className="text-xs text-muted">Nota 2</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">5</dd>
            </div>
            <div className="rounded-xl bg-brand-soft p-3">
              <dt className="text-xs text-brand">Final</dt>
              <dd className="mt-1 text-2xl font-bold text-brand tabular-nums">11</dd>
            </div>
          </dl>
          <p className="mt-5 text-xs text-muted">
            A nota final é a soma das duas notas. O aluno é aprovado com {NOTA_APROVACAO} ou mais.
          </p>
        </aside>
      </section>

      <section className="border-t border-line pt-12">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-xs font-extrabold tracking-[0.14em] text-brand uppercase">O que você faz aqui</p>
          <h2 className="text-2xl sm:text-3xl">Três telas, uma API</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {acessos.map((acesso) => (
            <Link
              key={acesso.numero}
              to={acesso.to}
              className="group grid min-h-40 grid-cols-[auto_1fr_auto] items-start gap-4 rounded-2xl border border-line bg-panel p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-panel-2"
            >
              <span className="text-xs font-extrabold tracking-[0.08em] text-brand">{acesso.numero}</span>
              <div>
                <h3 className="text-base font-bold">{acesso.titulo}</h3>
                <p className="mt-1.5 text-sm text-muted">{acesso.texto}</p>
              </div>
              <span aria-hidden="true" className="text-xl leading-none text-brand transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
