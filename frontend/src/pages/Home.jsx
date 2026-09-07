import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Home.css";

function Home() {
    const navigate = useNavigate();
    const [coletas, setColetas] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nomeColeta, setNomeColeta] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    useEffect(() => {
        carregarColetas();
    }, []);

    async function carregarColetas() {
        try {
            const resposta = await fetch("http://localhost:8080/coletas");
            if (!resposta.ok) throw new Error("Erro ao buscar coletas");
            const dados = await resposta.json();
            setColetas(dados);
        } catch (erro) {
            console.error("Erro:", erro);
        }
    }

    function abrirFormulario() {
        setMostrarFormulario(true);
    }

    function cancelarFormulario() {
        setMostrarFormulario(false);
        setNomeColeta("");
        setDataInicio("");
        setDataFim("");
    }

    async function adicionarColeta(e) {
        e.preventDefault();
        if (!nomeColeta.trim()) {
            alert("O nome da coleta é obrigatório.");
            return;
        }

        const novaColeta = {
            nomeColeta: nomeColeta.trim(),
            dataInicio: dataInicio,
            dataFim: dataFim
        };

        try {
            const resposta = await fetch("http://localhost:8080/coletas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novaColeta)
            });

            if (!resposta.ok) throw new Error("Erro ao criar coleta");

            const coletaCriada = await resposta.json();
            setColetas((coletasAtuais) => [...coletasAtuais, coletaCriada]);
            cancelarFormulario();
        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro ao criar a coleta.");
        }
    }

    function abrirColeta(coleta) {
        navigate(`/coleta/${coleta.id}`);
    }

    return (
        <div className="home-container">
            <Header />
            <main className="home-content">
                <h1>Bem-vindo!</h1>

                {!mostrarFormulario && (
                    <button className="btn-add" onClick={abrirFormulario}>
                        Adicionar Coleta
                    </button>
                )}

                {mostrarFormulario && (
                    <section className="formulario-coleta">
                        <form onSubmit={adicionarColeta}>
                            <h2>Nova Coleta</h2>

                            <div className="campo">
                                <label htmlFor="nomeColeta">Nome da Coleta</label>
                                <input
                                    id="nomeColeta"
                                    type="text"
                                    value={nomeColeta}
                                    onChange={(e) => setNomeColeta(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="campo">
                                <label htmlFor="dataInicio">Data de início</label>
                                <input
                                    id="dataInicio"
                                    type="date"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="campo">
                                <label htmlFor="dataFim">Data de término</label>
                                <input
                                    id="dataFim"
                                    type="date"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="botoes-formulario">
                                <button type="submit" className="btn-salvar">
                                    Criar Coleta
                                </button>
                                <button type="button" className="btn-cancelar" onClick={cancelarFormulario}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                <h2>Coletas</h2>

                <div className="coletas-containers">
                    {coletas.length === 0 ? (
                        <p>Nenhuma coleta cadastrada.</p>
                    ) : (
                        coletas.map((coleta) => (
                            <div className="coleta-card" key={coleta.id} onClick={() => abrirColeta(coleta)}>
                                <h2>{coleta.nomeColeta}</h2>
                                <p>Quantidade de grupos: {coleta.grupos?.length || 0}</p>
                                <p>
                                    Quantidade de pontos:{" "}
                                    {coleta.grupos
                                        ? coleta.grupos.reduce(
                                              (total, grupo) => total + (grupo.pontos?.length || 0),
                                              0
                                          )
                                        : 0}
                                </p>
                                <p>Data de início: {coleta.dataInicio || "-"}</p>
                                <p>Data de término: {coleta.dataFim || "-"}</p>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;