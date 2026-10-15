import type { BuscaRequest, BuscaResponse } from "./types";
import { ValidationError } from "./errors";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export async function buscarProfessor(
  req: BuscaRequest
): Promise<BuscaResponse> {
  const res = await fetch(`${BASE_URL}/api/professores/busca`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const mensagem =
      data?.mensagem ?? data?.message ?? data?.title ??
      "Não foi possível buscar professores.";

    if (res.status === 400) {
      throw new ValidationError([String(mensagem)]);
    }

    throw new Error(String(mensagem));
  }

  if (
    !Array.isArray(data?.professores ?? data?.Professores) ||
    !Array.isArray(data?.naoElegiveis ?? data?.NaoElegiveis)
  ) {
    throw new Error("A API retornou resultados em formato inválido.");
  }

  const professores = data.professores ?? data.Professores;
  const naoElegiveis = data.naoElegiveis ?? data.NaoElegiveis;

  return {
    professores: professores.map((p: any) => ({
      id: Number(p.id ?? p.Id),
      nome: String(p.nome ?? p.Nome ?? ""),
      aulasNaSemana: Number(p.aulasNaSemana ?? p.AulasNaSemana ?? 0),
      horarios: (p.horarios ?? p.Horarios ?? []).map(String),
    })),
    naoElegiveis: naoElegiveis.map((p: any) => ({
      id: Number(p.id ?? p.Id),
      nome: String(p.nome ?? p.Nome ?? ""),
      motivo: String(p.motivo ?? p.Motivo ?? ""),
    })),
  };
}