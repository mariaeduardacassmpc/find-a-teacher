import { useRef, useState } from "react";
import { Results } from "./components/Results";
import { SearchForm } from "./components/SearchForm";
import type { BuscaRequest, BuscaResponse } from "./types";
import { ValidationError, NetworkError } from "./errors";
import "./App.css";
import { buscarProfessor } from "./api";
import { Navbar } from "./components/Navbar";

type Estado =
  | { tipo: "inicial" }
  | { tipo: "carregando" }
  | { tipo: "sucesso"; dados: BuscaResponse }
  | { tipo: "validacao"; mensagens: string[] }
  | { tipo: "rede"; mensagem: string };

export default function App() {
  const [estado, setEstado] = useState<Estado>({ tipo: "inicial" });
  const ultimaBusca = useRef<BuscaRequest | null>(null);
  const contador = useRef(0);

  async function buscar(req: BuscaRequest) {
    ultimaBusca.current = req;
    const id = ++contador.current;
    setEstado({ tipo: "carregando" });
    try {
      const dados = await buscarProfessor(req);
      if (id === contador.current) setEstado({ tipo: "sucesso", dados });
    } catch (erro) {
      if (id !== contador.current) return;
      if (erro instanceof ValidationError) {
        setEstado({ tipo: "validacao", mensagens: erro.messages });
      } else {
        const mensagem =
          erro instanceof NetworkError ? erro.message : "Algo deu errado ao buscar.";
        setEstado({ tipo: "rede", mensagem });
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className="shell">
        <header className="top">
          <h2>Encontre um professor</h2>
          <p>Escolha idioma, dias, faixa de horário e duração para ver os professores que conseguem atender.</p>
        </header>

        <main className="layout">
          <SearchForm carregando={estado.tipo === "carregando"} onBuscar={buscar} />

          <section className="output" aria-live="polite">
            {estado.tipo === "carregando" && (
              <div className="card notice" role="status">
                <span className="spinner" aria-hidden="true" />
                <h2>Buscando professores…</h2>
              </div>
            )}

            {estado.tipo === "validacao" && (
              <div className="card alert" role="alert">
                <h2>Corrija os dados da busca</h2>
                <ul>
                  {estado.mensagens.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {estado.tipo === "rede" && (
              <div className="card alert" role="alert">
                <h2>Não deu para buscar agora</h2>
                <p>{estado.mensagem} Confira se a API está rodando e tente de novo.</p>
                <button
                  className="secondary"
                  type="button"
                  onClick={() => ultimaBusca.current && buscar(ultimaBusca.current)}
                >
                  Tentar de novo
                </button>
              </div>
            )}

            {estado.tipo === "sucesso" && <Results dados={estado.dados} />}
          </section>
        </main>
      </div>
    </>
  );
}