import { describe, expect, it } from "vitest";
import { calcularResultado, lerNota, resumirAlunos, validarAluno, type Aluno } from "../alunos";

const valores = { nome: "Maria Silva", email: "maria@escola.com", nota1: "5", nota2: "6" };

describe("calcularResultado", () => {
  it("nota final é a soma e 7 já aprova (igual à API)", () => {
    expect(calcularResultado(3, 4)).toEqual({ notaFinal: 7, status: "Aprovado" });
    expect(calcularResultado(3, 3)).toEqual({ notaFinal: 6, status: "Reprovado" });
    expect(calcularResultado(10, 10)).toEqual({ notaFinal: 20, status: "Aprovado" });
  });
});

describe("lerNota", () => {
  it("aceita inteiros de 0 a 10", () => {
    expect(lerNota("0", "nota 1")).toEqual({ valor: 0 });
    expect(lerNota(" 10 ", "nota 1")).toEqual({ valor: 10 });
  });

  it("recusa vazio, decimal, texto e fora do intervalo", () => {
    expect(lerNota("", "nota 1")).toEqual({ erro: "Informe a nota 1." });
    expect(lerNota("7,5", "nota 1")).toEqual({ erro: "A nota 1 deve ser um número inteiro." });
    expect(lerNota("7.5", "nota 1")).toEqual({ erro: "A nota 1 deve ser um número inteiro." });
    expect(lerNota("abc", "nota 1")).toEqual({ erro: "A nota 1 deve ser um número inteiro." });
    expect(lerNota("11", "nota 1")).toEqual({ erro: "A nota 1 deve estar entre 0 e 10." });
    expect(lerNota("-1", "nota 1")).toEqual({ erro: "A nota 1 deve ser um número inteiro." });
  });
});

describe("validarAluno", () => {
  it("devolve o aluno pronto para enviar, com texto aparado e notas numéricas", () => {
    const r = validarAluno({ ...valores, nome: "  Maria Silva ", nota1: "5", nota2: "6" });
    expect(r.erros).toEqual({});
    expect(r.aluno).toEqual({ nome: "Maria Silva", email: "maria@escola.com", nota1: 5, nota2: 6 });
  });

  it("junta os erros de todos os campos e não devolve aluno", () => {
    const r = validarAluno({ nome: "", email: "sem-arroba", nota1: "", nota2: "12" });
    expect(Object.keys(r.erros).sort()).toEqual(["email", "nome", "nota1", "nota2"]);
    expect(r.aluno).toBeUndefined();
  });

  it("respeita o limite de 100 caracteres do banco", () => {
    expect(validarAluno({ ...valores, nome: "a".repeat(101) }).erros.nome).toBeDefined();
    expect(validarAluno({ ...valores, nome: "a".repeat(100) }).erros.nome).toBeUndefined();
  });
});

describe("resumirAlunos", () => {
  const aluno = (id: number, notaFinal: number, status: Aluno["status"]): Aluno => ({
    id,
    nome: `Aluno ${id}`,
    email: `a${id}@e.com`,
    nota1: 0,
    nota2: 0,
    notaFinal,
    status,
  });

  it("lista vazia não gera divisão por zero", () => {
    expect(resumirAlunos([])).toEqual({ total: 0, aprovados: 0, reprovados: 0, mediaFinal: 0 });
  });

  it("conta aprovados e reprovados e calcula a média", () => {
    const r = resumirAlunos([aluno(1, 10, "Aprovado"), aluno(2, 4, "Reprovado"), aluno(3, 7, "Aprovado")]);
    expect(r).toEqual({ total: 3, aprovados: 2, reprovados: 1, mediaFinal: 7 });
  });
});
