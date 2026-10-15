import type { BuscaResponse } from "../types";

type Props = {
  dados: BuscaResponse | null;
};

export function Results({ dados }: Props) {

  const professores = dados?.professores ?? [];
  const naoElegiveis = dados?.naoElegiveis ?? [];

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
              ? "1 professor disponível"
              : `${professores.length} professores disponíveis`}
          </h2>

          <ul className="teachers">
            {professores.map((p) => (
              <li key={p.id} className="card teacher">
                <div className="teacher-head">
                  <h3>{p.nome}</h3>
                  <span className="load">
                    {p.aulasNaSemana === 1
                      ? "1 aula na semana"
                      : `${p.aulasNaSemana} aulas na semana`}
                  </span>
                </div>

                <ul className="slots" aria-label={`Horários de ${p.nome}`}>
                  {p.horarios.map((h) => (
                    <li key={h} className="slot">
                      {h}
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
          <summary>Ficaram de fora ({naoElegiveis.length})</summary>
          <ul>
            {naoElegiveis.map((p) => (
              <li key={p.id}>
                <strong>{p.nome}</strong>
                <span>{p.motivo}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}