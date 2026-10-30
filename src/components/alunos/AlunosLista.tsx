import { Link } from "@tanstack/react-router";
import type { Aluno } from "../../lib/alunos";
import { formatarNumero } from "../../lib/format";
import { StatusBadge } from "../ui/StatusBadge";

/**
 * Lista de alunos. Em telas largas aparece como tabela; em telas estreitas, como cartões
 * (uma tabela com 6 colunas não cabe no celular).
 */
export function AlunosLista({ alunos }: { alunos: Aluno[] }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-panel md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Lista de alunos com notas e status</caption>
          <thead className="border-b border-line bg-panel-2/60 text-xs tracking-[0.1em] text-muted uppercase">
            <tr>
              <th scope="col" className="px-5 py-3 font-bold">Aluno</th>
              <th scope="col" className="px-3 py-3 text-right font-bold">Nota 1</th>
              <th scope="col" className="px-3 py-3 text-right font-bold">Nota 2</th>
              <th scope="col" className="px-3 py-3 text-right font-bold">Final</th>
              <th scope="col" className="px-5 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {alunos.map((aluno) => (
              <tr key={aluno.id} className="hover:bg-panel-2/50">
                <td className="px-5 py-3.5">
                  <Link
                    to="/alunos/$id"
                    params={{ id: String(aluno.id) }}
                    className="font-semibold text-text underline-offset-4 hover:text-brand hover:underline"
                  >
                    {aluno.nome}
                  </Link>
                  <p className="text-xs text-muted">{aluno.email}</p>
                </td>
                <td className="px-3 py-3.5 text-right tabular-nums">{formatarNumero(aluno.nota1)}</td>
                <td className="px-3 py-3.5 text-right tabular-nums">{formatarNumero(aluno.nota2)}</td>
                <td className="px-3 py-3.5 text-right font-bold tabular-nums">{formatarNumero(aluno.notaFinal)}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={aluno.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-3 md:hidden">
        {alunos.map((aluno) => (
          <li key={aluno.id} className="rounded-2xl border border-line bg-panel p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  to="/alunos/$id"
                  params={{ id: String(aluno.id) }}
                  className="block truncate font-semibold hover:text-brand"
                >
                  {aluno.nome}
                </Link>
                <p className="truncate text-xs text-muted">{aluno.email}</p>
              </div>
              <StatusBadge status={aluno.status} />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-muted">
              <div>
                <dt>Nota 1</dt>
                <dd className="mt-0.5 text-base font-semibold text-text tabular-nums">{formatarNumero(aluno.nota1)}</dd>
              </div>
              <div>
                <dt>Nota 2</dt>
                <dd className="mt-0.5 text-base font-semibold text-text tabular-nums">{formatarNumero(aluno.nota2)}</dd>
              </div>
              <div>
                <dt>Final</dt>
                <dd className="mt-0.5 text-base font-bold text-text tabular-nums">{formatarNumero(aluno.notaFinal)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
