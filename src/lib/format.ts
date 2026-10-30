/** 7 -> "7", 7.5 -> "7,5" (formato brasileiro). */
export function formatarNumero(valor?: number | null, casas = 0): string {
  if (valor == null || isNaN(valor)) return "-"; // ou "0", conforme o padrão desejado

  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

/** Minúsculas e sem acentos, para a busca encontrar "Jose" ao digitar "José". */
export function normalizarTexto(texto?: string | null): string {
  if (!texto) return "";

  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}