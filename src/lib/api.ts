import axios from "axios";

/** Endereço da API. Em desenvolvimento vem do arquivo .env (VITE_API_URL); se faltar, usa o padrão local. */
export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  headers: { Accept: "application/json" },
});

/**
 * Transforma qualquer erro em uma frase que dá para mostrar ao usuário.
 *  - A API respondeu com erro (400, 404, 500): usa a mensagem do campo "erro" que ela envia.
 *  - Não houve resposta (API desligada, rede caiu, CORS): mensagem de conexão.
 */
export function mensagemDeErro(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const corpo = error.response.data as { erro?: unknown } | undefined;
      if (corpo && typeof corpo.erro === "string" && corpo.erro !== "") return corpo.erro;
      return `A API respondeu com erro (código ${error.response.status}).`;
    }
    if (error.code === "ECONNABORTED") return "A API demorou demais para responder. Tente de novo.";
    return "Não foi possível conectar à API. Confira se ela está rodando e tente de novo.";
  }
  return "Algo inesperado aconteceu. Tente de novo.";
}

export function erroNaoEncontrado(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
