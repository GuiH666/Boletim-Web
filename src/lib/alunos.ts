/*
 * Tipos e regras de negócio dos alunos.
 * As regras abaixo espelham exatamente o que a API (index.js) valida e calcula,
 * para o formulário avisar o erro antes de enviar e mostrar uma prévia do resultado.
 */

export const NOTA_MIN = 0;
export const NOTA_MAX = 10;
/** A API aprova quando a soma das duas notas é 7 ou mais. */
export const NOTA_APROVACAO = 7;

export type StatusAluno = "Aprovado" | "Reprovado";

/** Aluno como a API devolve em GET /alunos e GET /alunos/:id. */
export interface Aluno {
  id: number;
  nome: string;
  email: string;
  nota1: number;
  nota2: number;
  notaFinal: number;
  status: StatusAluno;
}

/** Corpo enviado em POST /alunos. */
export interface NovoAluno {
  nome: string;
  email: string;
  nota1: number;
  nota2: number;
}

/** Resposta de POST /alunos (201). */
export interface AlunoCriado {
  id: number;
  nome: string;
  notaFinal: number;
  status: StatusAluno;
}

export function calcularResultado(nota1: number, nota2: number): { notaFinal: number; status: StatusAluno } {
  const notaFinal = nota1 + nota2;
  return { notaFinal, status: notaFinal >= NOTA_APROVACAO ? "Aprovado" : "Reprovado" };
}

/* ---------- Validação do formulário ---------- */

export interface ValoresFormulario {
  nome: string;
  email: string;
  nota1: string;
  nota2: string;
}

export type CampoFormulario = keyof ValoresFormulario;
export type ErrosFormulario = Partial<Record<CampoFormulario, string>>;

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Converte o texto de uma nota em número inteiro de 0 a 10, ou devolve a mensagem de erro. */
export function lerNota(texto: string, rotulo: string): { valor: number } | { erro: string } {
  const limpo = texto.trim();
  if (limpo === "") return { erro: `Informe a ${rotulo}.` };
  // A tabela guarda as notas como INT, então só aceitamos números inteiros.
  if (!/^\d+$/.test(limpo)) return { erro: `A ${rotulo} deve ser um número inteiro.` };
  const valor = Number(limpo);
  if (valor < NOTA_MIN || valor > NOTA_MAX) return { erro: `A ${rotulo} deve estar entre ${NOTA_MIN} e ${NOTA_MAX}.` };
  return { valor };
}

export function validarAluno(valores: ValoresFormulario): { erros: ErrosFormulario; aluno?: NovoAluno } {
  const erros: ErrosFormulario = {};

  const nome = valores.nome.trim();
  if (nome === "") erros.nome = "Informe o nome do aluno.";
  else if (nome.length > 100) erros.nome = "O nome pode ter no máximo 100 caracteres.";

  const email = valores.email.trim();
  if (email === "") erros.email = "Informe o e-mail.";
  else if (!EMAIL_VALIDO.test(email)) erros.email = "Informe um e-mail válido, como nome@exemplo.com.";
  else if (email.length > 100) erros.email = "O e-mail pode ter no máximo 100 caracteres.";

  const nota1 = lerNota(valores.nota1, "nota 1");
  if ("erro" in nota1) erros.nota1 = nota1.erro;

  const nota2 = lerNota(valores.nota2, "nota 2");
  if ("erro" in nota2) erros.nota2 = nota2.erro;

  if (Object.keys(erros).length > 0 || "erro" in nota1 || "erro" in nota2) return { erros };

  return { erros, aluno: { nome, email, nota1: nota1.valor, nota2: nota2.valor } };
}

/* ---------- Resumo da lista ---------- */

export interface ResumoAlunos {
  total: number;
  aprovados: number;
  reprovados: number;
  /** Média da nota final (0 quando não há alunos). */
  mediaFinal: number;
}

export function resumirAlunos(alunos: Aluno[]): ResumoAlunos {
  const total = alunos.length;
  const aprovados = alunos.filter((a) => a.status === "Aprovado").length;
  const soma = alunos.reduce((acc, a) => acc + a.notaFinal, 0);
  return { total, aprovados, reprovados: total - aprovados, mediaFinal: total > 0 ? soma / total : 0 };
}
