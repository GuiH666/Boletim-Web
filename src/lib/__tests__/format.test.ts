import { describe, expect, it } from "vitest";
import { formatarNumero, normalizarTexto } from "../format";

describe("formatarNumero", () => {
  it("usa vírgula decimal", () => {
    expect(formatarNumero(7)).toBe("7");
    expect(formatarNumero(7.5, 1)).toBe("7,5");
    expect(formatarNumero(7, 2)).toBe("7,00");
  });

  it("valor ausente ou inválido vira traço", () => {
    expect(formatarNumero(undefined)).toBe("-");
    expect(formatarNumero(null)).toBe("-");
    expect(formatarNumero(NaN)).toBe("-");
  });
});

describe("normalizarTexto", () => {
  it("tira acento, caixa e espaços das pontas", () => {
    expect(normalizarTexto("  José ")).toBe("jose");
  });

  it("texto vazio ou ausente vira string vazia", () => {
    expect(normalizarTexto(undefined)).toBe("");
    expect(normalizarTexto(null)).toBe("");
    expect(normalizarTexto("")).toBe("");
  });
});
