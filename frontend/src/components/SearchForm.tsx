import { useState } from "react";
import type { BuscaRequest } from "../types";
import { IDIOMAS, DIAS, DURACOES } from "../types";

type Props = {
  carregando: boolean;
  onBuscar: (req: BuscaRequest) => void;
};

export function SearchForm({ carregando, onBuscar }: Props) {
  const [idioma, setIdioma] = useState(IDIOMAS[0]);
  const [dias, setDias] = useState<string[]>([]);
  const [inicioFaixa, setInicioFaixa] = useState("08:00");
  const [fimFaixa, setFimFaixa] = useState("18:00");
  const [duracaoMinutos, setDuracaoMinutos] = useState<number>(DURACOES[1]);

  function alternarDia(valor: string) {
    setDias((atual) =>
      atual.includes(valor) ? atual.filter((d) => d !== valor) : [...atual, valor]
    );
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    onBuscar({ idioma, dias, inicioFaixa, fimFaixa, duracaoMinutos });
  }

  function limpar() {
    setIdioma(IDIOMAS[0]);
    setDias([]);
    setInicioFaixa("08:00");
    setFimFaixa("18:00");
    setDuracaoMinutos(DURACOES[1]);
  }

  return (
    <form className="card form" onSubmit={enviar}>
      <label>
        Idioma
        <select value={idioma} onChange={(e) => setIdioma(e.target.value as typeof idioma)}>
          {IDIOMAS.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend>Dias</legend>
        {DIAS.map((d) => (
          <label key={d.valor}>
            <input
              type="checkbox"
              checked={dias.includes(d.valor)}
              onChange={() => alternarDia(d.valor)}
            />
            {d.rotulo}
          </label>
        ))}
      </fieldset>

      <label>
        Início
        <input type="time" value={inicioFaixa} onChange={(e) => setInicioFaixa(e.target.value)} />
      </label>

      <label>
        Fim
        <input type="time" value={fimFaixa} onChange={(e) => setFimFaixa(e.target.value)} />
      </label>

      <label>
        Duração
        <select value={duracaoMinutos} onChange={(e) => setDuracaoMinutos(Number(e.target.value))}>
          {DURACOES.map((d) => (
            <option key={d} value={d}>{d} min</option>
          ))}
        </select>
      </label>

    <div className="form-actions">
      <button type="submit" disabled={carregando}>
        {carregando ? "Buscando…" : "Buscar"}
      </button>

      <button
        type="button"
        className="secondary"
        onClick={limpar}
        disabled={carregando}
      >
        Limpar
      </button>
    </div>
    </form>
  );
}