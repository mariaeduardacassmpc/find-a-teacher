export type BuscaRequest = {
  idioma: string;
  dias: string[];
  inicioFaixa: string;
  fimFaixa: string;
  duracaoMinutos: number;
};

export type ProfessoresElegivel = {
  id: number;
  nome: string;
  aulasNaSemana: number;
  horarios: string[];
};

export type ProfessoresNaoElegivel = {
  id: number;
  nome: string;
  motivo: string;
};

export type BuscaResponse = {
  professores: ProfessoresElegivel[];
  naoElegiveis: ProfessoresNaoElegivel[];
};

export const IDIOMAS = ["Inglês", "Espanhol", "Francês"] as const;

export const DIAS = [
  { valor: "segunda", rotulo: "Seg" },
  { valor: "terca", rotulo: "Ter" },
  { valor: "quarta", rotulo: "Qua" },
  { valor: "quinta", rotulo: "Qui" },
  { valor: "sexta", rotulo: "Sex" },
  { valor: "sabado", rotulo: "Sáb" },
  { valor: "domingo", rotulo: "Dom" },
] as const;

export const DURACOES = [30, 60, 90] as const;