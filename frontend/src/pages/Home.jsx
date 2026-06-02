import { useEffect, useState } from "react";
import Header from "../components/Header";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
    const [rotas, setRotas] = useState([]);
    const [mensagem, setMensagem] = useState("");

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

    return (
        <div className="home-container">
            <Header />

            <div className="home-content">
                <h1>Bem-vindo!</h1>
                <p>Esta é a página inicial do aplicativo.</p>

                <div className="home-header">
                    <h2>Minhas Rotas</h2>

                    <div className="home-actions">
                        <button className="btn">
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
                                    <strong>Pontos:</strong>{" "}
                                    {rota.pontos?.join(" → ")}
                                </p>

                                <p>
                                    <strong>Clusters:</strong>{" "}
                                    {rota.clusters?.join(", ")}
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
        </div>
    );
}

export default Home;