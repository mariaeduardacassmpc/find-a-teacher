import type { BuscaResponse } from "../types";

type Props = {
  dados: BuscaResponse | null;
  idioma: string;
  dias: string[];
};

const WHATSAPP_NUMBER = "5511913702897";

function whatsappUrl(professor: string, horario: string, idioma: string, dias: string[]) 
{
  const diasFormatados = dias.join(", ");
  const mensagem = `Olá! Tenho interesse em ter aulas de ${idioma} com o(a) professor(a) ${professor}, nos dias ${diasFormatados}, às ${horario}.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

export function Results({ dados, idioma, dias }: Props) {
    if (!dados) {
    return null;
  }

  const professores = dados.professores ?? [];
  const naoElegiveis = dados.naoElegiveis ?? [];

  if (professores.length === 0 && naoElegiveis.length === 0) {
    return null;
  }

  return (
    <div className="results">
      {professores.length === 0 ? (
        <div className="card notice">
          <h2>Nenhum professor encontrado</h2>
          <p>
            Tente ampliar a faixa de horário, escolher menos dias ou uma
            duração menor.
          </p>
        </div>
      ) : (
        <>
          <h2 className="results-title">
            {professores.length === 1
              ? "1 Professor disponível"
              : `${professores.length} professores disponíveis`}
          </h2>

          <ul className="teachers">
            {professores.map((p) => (
              <li key={p.id} className="card teacher">
                <div className="teacher-head">
                  <h3>
                    <span className="teacher-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" focusable="false">
                        <circle cx="12" cy="8" r="3.5" />
                        <path d="M5 20c.7-3.4 3.1-5 7-5s6.3 1.6 7 5" />
                      </svg>
                    </span>
                    Prof. {p.nome}
                  </h3>
                  <span className="load">
                    {p.aulasNaSemana === 1
                      ? "1 aula disponível na semana"
                      : `${p.aulasNaSemana} aulas disponíveis na semana`}
                  </span>
                </div>

                <ul className="slots" aria-label={`Horários de ${p.nome}`}>
                  {p.horarios.map((h) => (
                    <li key={h} className="slot">
                      <a
                        href={whatsappUrl(p.nome, h, idioma, dias)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Solicitar o horário ${h} com ${p.nome} pelo WhatsApp`}
                        title="Clique para solicitar este horário pelo WhatsApp"
                      >
                        {h}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}

      {naoElegiveis.length > 0 && (
        <details className="card excluded">
          <summary>Indisponíveis no momento({naoElegiveis.length})</summary>
          <ul>
            {naoElegiveis.map((p) => (
              <li key={p.id}>
                <strong>Prof. {p.nome}</strong>
                <span>{p.motivo}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}