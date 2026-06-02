import { useEffect, useState } from "react";
import Header from "../components/Header";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
    const [rotas, setRotas] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nomeRota, setNomeRota] = useState("");
    const buscarRotas = async () => {
        try {
            const response = await fetch("http://localhost:8080/rotas");

            if (!response.ok) {
                setMensagem("Erro ao buscar rotas");
                return;
            }

            const data = await response.json();
            setRotas(data);

        } catch (error) {
            setMensagem("Erro ao conectar com servidor");
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        buscarRotas();
    }, []);

    const criarRota = async () => {
        if (!nomeRota.trim()) {
            setMensagem("Informe o nome da rota");
            return;
        }

        try {
            const usuario = JSON.parse(localStorage.getItem("usuario"));

            const response = await fetch(
                "http://localhost:8080/rotas",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nomeRota,
                        autoresResponsaveisID: [
                            String(usuario?.id)
                        ],
                        pontoOrigem: [],
                        pontos: [],
                        clusters: [],
                        matrizCustoGlobal: "[]",
                        matrizCustoClusters: "[]",
                        custoTotal: 0,
                        tempoTotal: 0
                    }),
                }
            );

            if (!response.ok) {
                setMensagem("Erro ao criar rota");
                return;
            }

            const rotaCriada = await response.json();

            setMostrarModal(false);
            setNomeRota("");

            buscarRotas();

            navigate(`/rota/${rotaCriada.id}`);

        } catch (error) {
            setMensagem("Erro ao criar rota");
        }
};

    return (
        <div className="home-container">
            <Header />

            <div className="home-content">
                <h1>Bem-vindo!</h1>
                <p>Esta é a página inicial do aplicativo.</p>

                <div className="home-header">
                    <h2>Minhas Rotas</h2>

                    <div className="home-actions">
                        <button
                            className="btn"
                            onClick={() => setMostrarModal(true)}
                        >
                            Nova rota
                        </button>

                        <button className="btn" onClick={buscarRotas}>
                            Atualizar
                        </button>
                    </div>
                </div>

                {mensagem && <p className="msg">{mensagem}</p>}

                <div className="home-cards">
                    {rotas.length > 0 ? (
                        rotas.map((rota) => (
                            <div
                                className="card"
                                key={rota.id}
                                onClick={() => navigate(`/rota/${rota.id}`)}
                            >
                                <h3>{rota.nomeRota}</h3>

                                <p>
                                    <strong>ID:</strong> {rota.id}
                                </p>

                                <p>
                                    <strong>Origem:</strong>{" "}
                                    {rota.pontoOrigem?.join(", ")}
                                </p>

                                <p>
                                    <strong>Qtd. Pontos:</strong>{" "}
                                    {rota.pontos.length}
                                </p>

                                <p>
                                    <strong>Qtd. Clusters:</strong>{" "}
                                    {rota.clusters.length}
                                </p>

                                <p>
                                    <strong>Custo:</strong>{" "}
                                    {rota.custoTotal}
                                </p>

                                <p>
                                    <strong>Tempo:</strong>{" "}
                                    {rota.tempoTotal}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>Nenhuma rota encontrada.</p>
                    )}
                </div>
            </div>
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Nova Rota</h2>

                        <p>Informe o nome da rota</p>

                        <input
                            type="text"
                            value={nomeRota}
                            onChange={(e) => setNomeRota(e.target.value)}
                            placeholder="Nome da rota"
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "10px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box"
                            }}
                        />

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                justifyContent: "center",
                                marginTop: "15px"
                            }}
                        >
                            <button
                                onClick={() => {
                                    setMostrarModal(false);
                                    setNomeRota("");
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={criarRota}
                                style={{
                                    background: "#009f10",
                                    color: "white"
                                }}
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;