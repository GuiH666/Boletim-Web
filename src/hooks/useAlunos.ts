import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, erroNaoEncontrado } from "../lib/api";
import type { Aluno, AlunoCriado, NovoAluno } from "../lib/alunos";

/*
 * Estado do servidor com TanStack Query.
 * Cada consulta tem uma "chave": quando a chave é invalidada, a lista é buscada de novo.
 */
export const alunosKeys = {
  lista: ["alunos"] as const,
  detalhe: (id: string) => ["alunos", id] as const,
};

/** GET /alunos */
export function useAlunos() {
  return useQuery({
    queryKey: alunosKeys.lista,
    queryFn: async () => {
      const { data } = await api.get<Aluno[]>("/alunos");
      return data;
    },
  });
}

/** GET /alunos/:id — não adianta tentar de novo quando o aluno não existe (404). */
export function useAluno(id: string) {
  return useQuery({
    queryKey: alunosKeys.detalhe(id),
    queryFn: async () => {
      const { data } = await api.get<Aluno>(`/alunos/${encodeURIComponent(id)}`);
      return data;
    },
    retry: (tentativas, error) => !erroNaoEncontrado(error) && tentativas < 1,
  });
}

/** POST /alunos — depois de cadastrar, a lista é marcada como desatualizada e busca de novo. */
export function useCriarAluno() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (novo: NovoAluno) => {
      const { data } = await api.post<AlunoCriado>("/alunos", novo);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: alunosKeys.lista }),
  });
}
