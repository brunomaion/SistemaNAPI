import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Home.css";

function Home() {
    const navigate = useNavigate();
    const [regioes, setRegioes] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nomeRegiao, setNomeRegiao] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    useEffect(() => {
        carregarRegioes();
    }, []);

    async function carregarRegioes() {
        try {
            const resposta = await fetch("http://localhost:8080/regioes");
            if (!resposta.ok) throw new Error("Erro ao buscar regiões");
            const dados = await resposta.json();
            setRegioes(dados);
        } catch (erro) {
            console.error("Erro:", erro);
        }
    }

    function abrirFormulario() {
        setMostrarFormulario(true);
    }

    function cancelarFormulario() {
        setMostrarFormulario(false);
        setNomeRegiao("");
        setDataInicio("");
        setDataFim("");
    }

    async function adicionarRegiao(e) {
        e.preventDefault();
        if (!nomeRegiao.trim()) {
            alert("O nome da região é obrigatório.");
            return;
        }

        const novaRegiao = {
            nomeRegiao: nomeRegiao.trim(),
            dataInicio: dataInicio,
            dataFim: dataFim
        };

        try {
            const resposta = await fetch("http://localhost:8080/regioes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novaRegiao)
            });

            if (!resposta.ok) throw new Error("Erro ao criar região");

            const regiaoCriada = await resposta.json();
            setRegioes((regioesAtuais) => [...regioesAtuais, regiaoCriada]);
            cancelarFormulario();
        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro ao criar a região.");
        }
    }

    function abrirRegiao(regiao) {
        navigate(`/regiao/${regiao.id}`);
    }

    return (
        <div className="home-container">
            <Header />
            <main className="home-content">
                <h1>Bem-vindo!</h1>

                {!mostrarFormulario && (
                    <button className="btn-add" onClick={abrirFormulario}>
                        Adicionar Região
                    </button>
                )}

                {mostrarFormulario && (
                    <section className="formulario-regiao">
                        <form onSubmit={adicionarRegiao}>
                            <h2>Nova Região</h2>

                            <div className="campo">
                                <label htmlFor="nomeRegiao">Nome da Região</label>
                                <input
                                    id="nomeRegiao"
                                    type="text"
                                    value={nomeRegiao}
                                    onChange={(e) => setNomeRegiao(e.target.value)}
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
                                    Criar Região
                                </button>
                                <button type="button" className="btn-cancelar" onClick={cancelarFormulario}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                <h2>Regiões</h2>

                <div className="regioes-containers">
                    {regioes.length === 0 ? (
                        <p>Nenhuma região cadastrada.</p>
                    ) : (
                        regioes.map((regiao) => (
                            <div className="regiao-card" key={regiao.id} onClick={() => abrirRegiao(regiao)}>
                                <h2>{regiao.nomeRegiao}</h2>
                                <p>Quantidade de grupos: {regiao.grupos?.length || 0}</p>
                                <p>
                                    Quantidade de pontos:{" "}
                                    {regiao.grupos
                                        ? regiao.grupos.reduce(
                                              (total, grupo) => total + (grupo.pontos?.length || 0),
                                              0
                                          )
                                        : 0}
                                </p>
                                <p>Data de início: {regiao.dataInicio || "-"}</p>
                                <p>Data de término: {regiao.dataFim || "-"}</p>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;
