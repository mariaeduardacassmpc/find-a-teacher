import type { BuscaRequest, BuscaResponse } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

function normalizarBuscaResponse(data: unknown): BuscaResponse {
  if (!data || typeof data !== "object") {
    throw new Error("A API retornou uma resposta inválida.");
  }

  const resposta = data as Record<string, unknown>;
  const professores =
    resposta.professores ?? resposta.Professores;
  const naoElegiveis =
    resposta.naoElegiveis ?? resposta.NaoElegiveis;

  if (!Array.isArray(professores) || !Array.isArray(naoElegiveis)) {
    throw new Error("A API retornou os resultados em um formato inválido.");
  }

  return {
    professores: professores.map((professor) => {
      const item = professor as Record<string, unknown>;
      return {
        id: Number(item.id ?? item.Id),
        nome: String(item.nome ?? item.Nome ?? ""),
        aulasNaSemana: Number(item.aulasNaSemana ?? item.AulasNaSemana ?? 0),
        horarios: Array.isArray(item.horarios)
          ? item.horarios.map(String)
          : Array.isArray(item.Horarios)
            ? item.Horarios.map(String)
            : [],
      };
    }),
    naoElegiveis: naoElegiveis.map((professor) => {
      const item = professor as Record<string, unknown>;
      return {
        id: Number(item.id ?? item.Id),
        nome: String(item.nome ?? item.Nome ?? ""),
        motivo: String(item.motivo ?? item.Motivo ?? ""),
      };
    }),
  };
}

export async function buscarProfessor(req: BuscaRequest): Promise<BuscaResponse> {
  const res = await fetch(`${BASE_URL}/api/professores/busca`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const mensagem =
      data?.mensagem ??
      data?.message ??
      data?.title ??
      "Não foi possível buscar professores.";

    throw new Error(String(mensagem));
  }

  return normalizarBuscaResponse(data);
}